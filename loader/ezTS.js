'use strict'

class ezTS$Hash {
    static MIN_INT_VALUE = -(2 ^ 31);
    static MAX_INT_VALUE = (2 ^ 31) - 1;
    static NULL_VALUE = ezTS$Hash.MIN_INT_VALUE + 1;
    static UNDEFINED_VALUE = ezTS$Hash.MIN_INT_VALUE + 2;
    static FUNCTION_VALUE = ezTS$Hash.MIN_INT_VALUE + 3;
    static OTHER_VALUE = ezTS$Hash.MIN_INT_VALUE + 3;

    static BASE_MAGIC = 2166136261;
    static BASE_MAGIC_N = BigInt(ezTS$Hash.BASE_MAGIC);
    static STEP_MAGIC = 16777619;
    static STEP_MAGIC_N = BigInt(ezTS$Hash.STEP_MAGIC);

    static BIGINT_32BIT_MASK = 0xFFFFFFFFn;

    static hash(source) {
        return ezTS$Hash.fnv32a(source);
    }

    static fnv32a(value) {
        if (value === null) return ezTS$Hash.NULL_VALUE;
        if (value === undefined) return ezTS$Hash.UNDEFINED_VALUE;

        const type = typeof value;
        if (type === "function") {
            return ezTS$Hash.FUNCTION_VALUE;
        }
        if (type === "boolean") {
            return value ? 1 : 0;
        }
        if (type === "symbol") {
            return fnv32a(value.toString());
        }
        if (type === "bigint") {
            let h = ezTS$Hash.BASE_MAGIC_N;
            let tmpValue = value;
            while (tmpValue > 0n) {
                const part = value & ezTS$Hash.BIGINT_32BIT_MASK;
                h = (h ^ part) * ezTS$Hash.STEP_MAGIC_N;
                tmpValue >>= 32n;
            }
            return Number(h >>> 0n);
        }

        let h = ezTS$Hash.BASE_MAGIC;
        if (type === "number" || type === "string") {
            let bytes;

            if (Number.isInteger(value)) {
                if (value >= ezTS$Hash.MIN_INT_VALUE && value <= ezTS$Hash.MAX_INT_VALUE) {
                    return value;
                }
                bytes = new Uint8Array(new Uint32Array([value]).buffer);
            } else if (type === "string") {
                bytes = new TextEncoder().encode(value);
            } else {
                bytes = new Uint8Array(new Float64Array([value]).buffer);
            }
            for (let i = 0; i < bytes.length; i++) {
                h = (h ^ bytes[i]) * ezTS$Hash.STEP_MAGIC;
            }
        } else if (type === "object") {
            let h = ezTS$Hash.BASE_MAGIC;
            for (const key of Object.getOwnPropertySymbols(value)) {
                h = (h ^ fnv32a(key)) * ezTS$Hash.STEP_MAGIC;
                const val = value[key];
                h = (h ^ fnv32a(val)) * ezTS$Hash.STEP_MAGIC;
            }
            for (const key of Object.getOwnPropertyNames(value)) {
                h = (h ^ fnv32a(key)) * ezTS$Hash.STEP_MAGIC;
                const val = value[key];
                h = (h ^ fnv32a(val)) * ezTS$Hash.STEP_MAGIC;
            }
        } else {
            return ezTS$Hash.OTHER_VALUE;
        }
        return h >>> 0; // Преобразуем в беззнаковое 32-битное число
    }
}

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

class ezTS$Cache {
    static DATE_LENGTH = ezTS$Cache.#dateToString(new Date()).length;

    /**
     * References to a cache storage, basically a browser local storage.
     */
    #storage;
    #enabled = true;

    constructor(storage = localStorage) {
        if (storage === null || storage === undefined || !(typeof storage === "object")) {
            throw new Error("Invalid storage provided.");
        }
        this.#storage = storage;
    }

    setEnabled(value) {
        this.#enabled = value;
    }

    /**
     * @param {*} key index key.
     * @param {*} expireDate date after which the cached entry will be updated.
     * @param {*} asyncValueProvider invoked when cache does not contains entry for provided key or the entry is expired.
     * @returns cached or newly calculated value
     */
    async get(key, expireDate, asyncValueProvider) {
        if (this.#enabled) {
            let cachedValue = this.#storage.getItem(key);
            if (ezTS$Cache.#isValidEntry(cachedValue)) {
                return cachedValue.substring(ezTS$Cache.DATE_LENGTH);
            }
        }
        let value = await asyncValueProvider();
        if (this.#enabled) {
            this.#updateValue(key, expireDate, value);
        }
        return value;
    }

    /**
     * Removes from cache all the expired entries
     */
    clearExpiredStorage() {
        let toRemove = [];
        for (let i = 0; i < this.#storage.length; i++) {
            let key = this.#storage.key(i);
            let value = this.#storage.getItem(key);

            if (!ezTS$Cache.#isValidEntry(value)) {
                toRemove.push(key)
            }
        }
        toRemove.forEach(e => this.#storage.removeItem(e));
    }

    #updateValue(key, expireDate, value) {
        let expString = ezTS$Cache.#dateToString(expireDate);
        this.#storage.setItem(key, expString + value);
    }

    static #dateToString(date) {
        if (!(date instanceof Date)) {
            const ms = Date.parse(date);
            if (isNaN(ms)) {
                date = new Date();
            } else {
                date = new Date(ms);
            }
        }
        return date.toISOString().split('T')[0];
    }

    static #isValidDate(date) {
        if (typeof date === "string") {
            date = new Date(date);
        }
        if (!(date instanceof Date)) {
            return false;
        }
        return date >= new Date();
    }

    static #isValidEntry(value) {
        if (typeof value === "string") {
            let expDate = value.substring(0, ezTS$Cache.DATE_LENGTH);
            if (!expDate.match(/\d{4}-\d{2}-\d{2}/)) {
                return true;
            }
            if (ezTS$Cache.#isValidDate(expDate)) {
                return true;
            }
        }
        return false;
    }
}

class ezTS {
    static MAIN_FN_NAME = "ezTS_main";
    static READY_FN_NAME = "ezTS_ready";
    static DEFAULT_TS_URL = "https://cdn.jsdelivr.net/npm/typescript@5.9.3/lib/typescript.min.js";
    static ENCODER = new TextEncoder();

    #tsUrl;
    #modules;
    #cache;
    #importMap = {};

    constructor(tsUrl) {
        this.#tsUrl = tsUrl;
        this.#cache = new ezTS$Cache();
        this.#cache.setEnabled(false)
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

        const codeHash = ezTS$Hash.hash(tsCodeWithAbsoluteImports);

        const aDayLater = new Date();
        aDayLater.setDate(aDayLater.getDate() + 1);
        const expireDate = aDayLater.toISOString().substring(0, 10);

        const jsCode = await this.#cache.get(codeHash, expireDate,
            async () => await this.#compileTs(targetFileName, tsCodeWithAbsoluteImports)
        );

        const jsBlob = new Blob([jsCode], {type: "application/javascript"});
        return URL.createObjectURL(jsBlob);
    }

    async #loadImports(tsFileName, tsCode) {
        const importsMatches = tsCode.matchAll(/^(^\s*(?:import|export).*from\s+["'])([^"']+\.ts)(["'])/gm);
        const imports = [...importsMatches].reverse();

        let result = tsCode;

        for (let imp of imports) {
            const name = imp[2];
            const targetFileName = ezTS$Path.reducePath(ezTS$Path.relativeFile(tsFileName, name));
            let realUrl;
            if (this.#importMap[targetFileName]) {
                realUrl = this.#importMap[targetFileName];
            } else {
                realUrl = await this.#loadAndCompileTS(targetFileName);
                this.#importMap[targetFileName] = realUrl
            }
            result = result.substring(0, imp.index) + imp[1] + realUrl + imp[3] + result.substring(imp.index + imp[0].length);
        }
        return result;
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

    static async import(params) {
        let pathToCaller;
        if (document.currentScript !== null) {
            pathToCaller = ezTS$Path.relativePath(ezTS$Path.folderOf(document.currentScript.src), ezTS$Path.folderOf(window.location.href));
        } else {
            pathToCaller = ezTS$Path.folderOf(document.location.href);
        }

        const ez = new ezTS(params.tsUrl);
        return await ez.import(...params.modules);
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