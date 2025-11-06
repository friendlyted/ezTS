class WebWorkerFrontend {
    #worker;

    constructor(workerUrl) {
        this.#worker = new Worker(workerUrl, {type: "module"});
    }

    async call(type, ...args) {
        return new Promise((ok, err) => {
            const id = Math.random().toString(36).substring(2);
            const listener = (event) => {
                const data = event.data;
                if (typeof data !== "object") return;
                if (data.type !== type) return;
                if (data.id !== id) return;

                if (data["exception"] === true) {
                    const restoredError = new Error(data.message);
                    restoredError.name = data.name;
                    try {
                        restoredError.stack = data.stack;
                    } catch (ex) {
                        console.log("Cannot write stack field in exception. Stack was: ");
                        console.error(data.stack);
                    }
                    err(restoredError);
                } else {
                    ok(data.result);
                }
                this.#worker.removeEventListener("message", listener);
            };
            this.#worker.addEventListener("message", listener)
            this.#worker.postMessage({id, type, args});
        })
    }
}

export class TsWebCompiler {
    #worker;

    constructor(workerUrl) {
        this.#worker = new WebWorkerFrontend(workerUrl);
    }

    async compileTs(main, tsUrl) {
        return await this.#worker.call("COMPILE_TS", window.location.href, main, tsUrl);
    }
}

export async function installSW(url) {
    const swReg = await navigator.serviceWorker.register(url);

    await new Promise(ok => {
        let workerIsWorking = false;
        const listener = () => {
            if (swReg.active) {
                ok();
                swReg.removeEventListener("updatefound", listener);
            }
        }
        // listener if worker is not ready yet
        swReg.addEventListener("updatefound", listener);
        setTimeout(() => {
            if (swReg.active) {
                // if worker was ready before
                ok();
                workerIsWorking = true;
            }
        }, 0);
        setTimeout(async () => {
            // Weird case
            // If you use a Hard Reload (ctrl+F5 or ctrl+shift+R), the browser ignores all service workers.
            // We need to do a usual Soft Reload to make our Service Worker active on this page.
            try {
                // It's quite difficult to determine whether the service worker is available via the API for all browsers.
                // Therefore, we check for a deliberately unavailable address hardcoded into our service worker.
                await fetch("https://test.undefined/");
            } catch (ex) {
                // The site is unavailable: this means the request bypassed our service worker.
                // Soft Reload the page.
                window.location.reload();
            }
        }, 1000);
    })

    return swReg;
}

export async function importTS(main) {
    const mainUrl = new URL(main.replace(".ts", ".js"), new URL(window.location.href));
    return import(mainUrl);
}


export async function ezTsImport(options = {}) {
    options = Object.assign({
        tsUrl: "https://cdn.jsdelivr.net/npm/typescript@5.9.3/lib/typescript.min.js",
        serviceWorker: "./service-worker.js",
        webWorker: "./web-worker.js",
        entryPointFiles: ["./index.ts"],
    }, options);

    const sw = await installSW(options.serviceWorker);

    const result = await Promise.all(options.entryPointFiles.map(async (url) => {
        const jsSources = await new TsWebCompiler(options.webWorker)
            .compileTs(url, options.tsUrl);

        sw.active.postMessage(jsSources);
        await new Promise(ok => setTimeout(ok(), 30)); // let worker to update it's mock files

        const compiledEntryPoint = url.replace(/(.*)\/(.*).ts/, "$1/$$build/$2.js")

        const jsUrl = new URL(compiledEntryPoint, new URL(window.location.href));
        return await import(jsUrl);
    }));

    return result;
}