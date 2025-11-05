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

    constructor() {
        this.#worker = new WebWorkerFrontend("http://localhost:8000/loader/web-worker.js");
    }

    async compileTs(main) {
        return await this.#worker.call("COMPILE_TS", window.location.href, main);
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
        swReg.addEventListener("updatefound", listener);
        setTimeout(() => {
            if (swReg.active) {
                ok();
                workerIsWorking = true;
            }
        }, 0);
        setTimeout(async () => {
            try{
                await fetch("https://test.undefined/");
            } catch (ex) {
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
