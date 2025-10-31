'use strict'

class ezTS$Path {
    static relativePath(fromPath, toPath) {
        const fromParts = fromPath.split('/');
        const toParts = toPath.split('/');

        let commonLength = 0;
        while (
            commonLength < fromParts.length &&
            commonLength < toParts.length &&
            fromParts[commonLength] === toParts[commonLength]
            ) {
            commonLength++;
        }

        const relativeParts = [];
        for (let i = commonLength; i < fromParts.length - 1; i++) {
            relativeParts.push('..');
        }
        for (let i = commonLength; i < toParts.length; i++) {
            relativeParts.push(toParts[i]);
        }

        return relativeParts.join('/');
    }

    static reducePath(relativePath) {
        let result = relativePath;
        while (result.indexOf("../") !== -1) {
            result = result.replace(/\/\w+\/\.\.\//g, "/");// remove parent "../"
        }
        return result.replace(/\/(.\/)+/g, "/") // remove "./"
    }

    static folderOf(file) {
        return file.replace(/(.*\/).*/g, "$1");
    }

    static relativeFile(fromFile, targetFile) {
        if (!targetFile.startsWith(".")) return targetFile;
        return ezTS$Path.folderOf(fromFile) + targetFile;
    }
}

class ezTS {
    static MAIN_FN_NAME = "ezTS_main";
    static READY_FN_NAME = "ezTS_ready";
    static WAIT_FOR_DEBUGGER = "ezTS_wait_for_debugger";
    static DEFAULT_TS_URL = "https://cdn.jsdelivr.net/npm/typescript@5.9.3/lib/typescript.min.js";
    static LOCAL_TS_URL = "../../lib/typescript-5.8.3.min.js";
    static ENCODER = new TextEncoder();

    #tsUrl;
    #importMap = {};
    static #instance;

    constructor(tsUrl) {
        this.#tsUrl = tsUrl;
    }

    async import(...modules) {
        return await Promise.all(modules.map(async (mod) => {
            const realUrl = await this.#loadAndCompileTS(mod);
            return await import(realUrl);
        }));
    }

    async #loadAndCompileTS(tsFileName) {
        const urlFile = ezTS$Path.relativeFile(window.location.href, tsFileName);
        const targetFileName = ezTS$Path.reducePath(urlFile);

        const tsCode = await ezTS.fetchFile(targetFileName);

        const tsCodeWithRealImports = await this.#loadImports(targetFileName, tsCode);

        const tsCodeWithAbsoluteImports = ezTS.replaceRelativeImports(targetFileName, tsCodeWithRealImports);

        const jsCode = await this.#compileTs(targetFileName, tsCodeWithAbsoluteImports);

        const jsBlob = new Blob([jsCode], {type: "application/javascript"});
        return URL.createObjectURL(jsBlob);
    }

    static async #smartReplace(src, regex, callback) {
        const matches = src.matchAll(regex);
        const imports = [...matches].reverse();

        let result = src;

        for (let imp of imports) {
            const replaceValue = await callback(imp);
            result = result.substring(0, imp.index) + replaceValue + result.substring(imp.index + imp[0].length);
        }
        return result;
    }

    async #loadImports(tsFileName, tsCode) {
        const tsCodeWithFixedStaticImports = await ezTS.#smartReplace(
            tsCode,
            /^(^\s*(?:import|export).*from\s+["'])([^"']+\.ts)(["'])/gm,
            async imp => {
                const name = imp[2];
                const targetFileName = ezTS$Path.reducePath(ezTS$Path.relativeFile(tsFileName, name));
                let realUrl;
                if (this.#importMap[targetFileName]) {
                    realUrl = this.#importMap[targetFileName];
                } else {
                    realUrl = await this.#loadAndCompileTS(targetFileName);
                    this.#importMap[targetFileName] = realUrl
                }
                return imp[1] + realUrl + imp[3]
            })

        const tsCodeWithFixedDynamicImports = tsCodeWithFixedStaticImports
            .replaceAll(/(\s)import(\s*)\(/gm, "$1ezTS.importSingle$2(")

        return tsCodeWithFixedDynamicImports;
    }

    #prepareTypeScriptCompiler() {
        return new Promise((resolve, reject) => {
            if (window["ts"]) resolve(ts);
            else {
                let script = document.createElement("script");
                script.setAttribute("type", "application/javascript");
                script.setAttribute("src", this.#tsUrl);
                script.onload = () => resolve(ts);
                document.body.appendChild(script);
            }
        })
    }

    async #compileTs(name, src) {
        let ts = await this.#prepareTypeScriptCompiler();

        return ts.transpileModule(src, {
            compilerOptions: {
                esModuleInterop: true,
                skipLibCheck: true,
                strict: true,
                module: ts.ModuleKind.ESNext,
                target: ts.ScriptTarget.ES2015,

                sourceMap: true,
                inlineSourceMap: true,
                inlineSources: true,
                sourceRoot: ezTS$Path.folderOf(name),
            },
            fileName: name
        }).outputText;
    }

    static ready() {
        if (typeof window !== "undefined") {
            const readyCallback = window[ezTS.READY_FN_NAME];
            if (typeof readyCallback === "function") {
                readyCallback();
            }
        }
    }

    static async importSingle(name) {
        if (!ezTS.#instance) {
            throw new Error("ezTS is not initialized")
        }
        const modules = await ezTS.#instance.import(name);
        return modules[0];
    }

    static async import(params) {
        if (!ezTS.#instance) {
            ezTS.#instance = new ezTS(params.tsUrl);
        }
        return await ezTS.#instance.import(...params.modules);
    }

    static async fetchFile(file) {
        const response = await fetch(file);
        if (!response.ok) {
            throw `HTTP error! status: ${response.status}`;
        }
        return await response.text();
    }

    static replaceRelativeImports(targetFile, src) {
        let currentLocation = ezTS$Path.folderOf(targetFile);
        return src.replaceAll(/^(^\s*(?:import|export).*from\s+["'])(\.[^"']+\.[tj]s)/gm, "$1" + currentLocation + "$2");
    }

    static easyStart() {
        const mainModule = window[ezTS.MAIN_FN_NAME];
        if (typeof mainModule !== "undefined") {
            (async () => {
                let [module] = await ezTS.import({
                    tsUrl: ezTS.DEFAULT_TS_URL,
                    modules: [mainModule]
                });

                if (window[ezTS.WAIT_FOR_DEBUGGER] === true) {
                    // wait while debugger is attaching breakpoints
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
                module.main();
            })();
        }
    }
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        ezTS.easyStart();
    })
}