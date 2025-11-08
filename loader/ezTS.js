const TS_LIBS_REGISTER = [
    "_tsc.js",
    "_tsserver.js",
    "_typingsInstaller.js",
    "lib.d.ts",
    "lib.decorators.d.ts",
    "lib.decorators.legacy.d.ts",
    "lib.dom.asynciterable.d.ts",
    "lib.dom.d.ts",
    "lib.dom.iterable.d.ts",
    "lib.es5.d.ts",
    "lib.es6.d.ts",
    "lib.es2015.collection.d.ts",
    "lib.es2015.core.d.ts",
    "lib.es2015.d.ts",
    "lib.es2015.generator.d.ts",
    "lib.es2015.iterable.d.ts",
    "lib.es2015.promise.d.ts",
    "lib.es2015.proxy.d.ts",
    "lib.es2015.reflect.d.ts",
    "lib.es2015.symbol.d.ts",
    "lib.es2015.symbol.wellknown.d.ts",
    "lib.es2016.array.include.d.ts",
    "lib.es2016.d.ts",
    "lib.es2016.full.d.ts",
    "lib.es2016.intl.d.ts",
    "lib.es2017.arraybuffer.d.ts",
    "lib.es2017.d.ts",
    "lib.es2017.date.d.ts",
    "lib.es2017.full.d.ts",
    "lib.es2017.intl.d.ts",
    "lib.es2017.object.d.ts",
    "lib.es2017.sharedmemory.d.ts",
    "lib.es2017.string.d.ts",
    "lib.es2017.typedarrays.d.ts",
    "lib.es2018.asyncgenerator.d.ts",
    "lib.es2018.asynciterable.d.ts",
    "lib.es2018.d.ts",
    "lib.es2018.full.d.ts",
    "lib.es2018.intl.d.ts",
    "lib.es2018.promise.d.ts",
    "lib.es2018.regexp.d.ts",
    "lib.es2019.array.d.ts",
    "lib.es2019.d.ts",
    "lib.es2019.full.d.ts",
    "lib.es2019.intl.d.ts",
    "lib.es2019.object.d.ts",
    "lib.es2019.string.d.ts",
    "lib.es2019.symbol.d.ts",
    "lib.es2020.bigint.d.ts",
    "lib.es2020.d.ts",
    "lib.es2020.date.d.ts",
    "lib.es2020.full.d.ts",
    "lib.es2020.intl.d.ts",
    "lib.es2020.number.d.ts",
    "lib.es2020.promise.d.ts",
    "lib.es2020.sharedmemory.d.ts",
    "lib.es2020.string.d.ts",
    "lib.es2020.symbol.wellknown.d.ts",
    "lib.es2021.d.ts",
    "lib.es2021.full.d.ts",
    "lib.es2021.intl.d.ts",
    "lib.es2021.promise.d.ts",
    "lib.es2021.string.d.ts",
    "lib.es2021.weakref.d.ts",
    "lib.es2022.array.d.ts",
    "lib.es2022.d.ts",
    "lib.es2022.error.d.ts",
    "lib.es2022.full.d.ts",
    "lib.es2022.intl.d.ts",
    "lib.es2022.object.d.ts",
    "lib.es2022.regexp.d.ts",
    "lib.es2022.string.d.ts",
    "lib.es2023.array.d.ts",
    "lib.es2023.collection.d.ts",
    "lib.es2023.d.ts",
    "lib.es2023.full.d.ts",
    "lib.es2023.intl.d.ts",
    "lib.es2024.arraybuffer.d.ts",
    "lib.es2024.collection.d.ts",
    "lib.es2024.d.ts",
    "lib.es2024.full.d.ts",
    "lib.es2024.object.d.ts",
    "lib.es2024.promise.d.ts",
    "lib.es2024.regexp.d.ts",
    "lib.es2024.sharedmemory.d.ts",
    "lib.es2024.string.d.ts",
    "lib.esnext.array.d.ts",
    "lib.esnext.collection.d.ts",
    "lib.esnext.d.ts",
    "lib.esnext.decorators.d.ts",
    "lib.esnext.disposable.d.ts",
    "lib.esnext.error.d.ts",
    "lib.esnext.float16.d.ts",
    "lib.esnext.full.d.ts",
    "lib.esnext.intl.d.ts",
    "lib.esnext.iterator.d.ts",
    "lib.esnext.promise.d.ts",
    "lib.esnext.sharedmemory.d.ts",
    "lib.scripthost.d.ts",
    "lib.webworker.asynciterable.d.ts",
    "lib.webworker.d.ts",
    "lib.webworker.importscripts.d.ts",
    "lib.webworker.iterable.d.ts",
    "tsc.js",
    "tsserver.js",
    "tsserverlibrary.d.ts",
    "tsserverlibrary.js",
    "typescript.d.ts",
    "typescript.js",
    "typesMap.json",
    "typingsInstaller.js",
    "watchGuard.js"
];

function global() {
    if (typeof window !== "undefined") return window;
    if (typeof self !== "undefined") return self;
    throw new Error("There is no known global object");
}

function ts() {
    return global()["ts"];
}

class Hash {
    static MIN_INT_VALUE = -(2 ^ 31);
    static MAX_INT_VALUE = (2 ^ 31) - 1;
    static NULL_VALUE = Hash.MIN_INT_VALUE + 1;
    static UNDEFINED_VALUE = Hash.MIN_INT_VALUE + 2;
    static FUNCTION_VALUE = Hash.MIN_INT_VALUE + 3;
    static OTHER_VALUE = Hash.MIN_INT_VALUE + 3;

    static BASE_MAGIC = 2166136261;
    static BASE_MAGIC_N = BigInt(Hash.BASE_MAGIC);
    static STEP_MAGIC = 16777619;
    static STEP_MAGIC_N = BigInt(Hash.STEP_MAGIC);

    static BIGINT_32BIT_MASK = 0xFFFFFFFFn;

    static hash(source) {
        return Hash.fnv32a(source);
    }

    static fnv32a(value) {
        if (value === null) return Hash.NULL_VALUE;
        if (value === undefined) return Hash.UNDEFINED_VALUE;

        const type = typeof value;
        if (type === "function") {
            return Hash.FUNCTION_VALUE;
        }
        if (type === "boolean") {
            return value ? 1 : 0;
        }
        if (type === "symbol") {
            return Hash.fnv32a(value.toString());
        }
        if (type === "bigint") {
            let h = Hash.BASE_MAGIC_N;
            let tmpValue = value;
            while (tmpValue > 0n) {
                const part = value & Hash.BIGINT_32BIT_MASK;
                h = (h ^ part) * Hash.STEP_MAGIC_N;
                tmpValue >>= 32n;
            }
            return Number(h >>> 0n);
        }

        let h = Hash.BASE_MAGIC;
        if (type === "number" || type === "string") {
            let bytes;

            if (Number.isInteger(value)) {
                if (value >= Hash.MIN_INT_VALUE && value <= Hash.MAX_INT_VALUE) {
                    return value;
                }
                bytes = new Uint8Array(new Uint32Array([value]).buffer);
            } else if (type === "string") {
                bytes = new TextEncoder().encode(value);
            } else {
                bytes = new Uint8Array(new Float64Array([value]).buffer);
            }
            for (let i = 0; i < bytes.length; i++) {
                h = (h ^ bytes[i]) * Hash.STEP_MAGIC;
            }
        } else if (type === "object") {
            for (const key of Object.getOwnPropertySymbols(value)) {
                h = (h ^ Hash.fnv32a(key)) * Hash.STEP_MAGIC;
                const val = value[key];
                h = (h ^ Hash.fnv32a(val)) * Hash.STEP_MAGIC;
            }
            for (const key of Object.getOwnPropertyNames(value)) {
                h = (h ^ Hash.fnv32a(key)) * Hash.STEP_MAGIC;
                const val = value[key];
                h = (h ^ Hash.fnv32a(val)) * Hash.STEP_MAGIC;
            }
        } else {
            return Hash.OTHER_VALUE;
        }
        return h >>> 0; // Преобразуем в беззнаковое 32-битное число
    }
}

class TsCache {
    static DB_NAME = "tsCache";
    static DB_VERSION = 1;
    static STORE_NAME = "cacheStore";
    static DATE_INDEX = "date_idx";

    #disabled = false;
    /** @type IDBDatabase */
    #database;

    constructor() {
        this.#disabled = typeof indexedDB === "undefined";
    }

    async #getDB() {
        if (!this.#database) {
            this.#database = await TsCache.#openDB(TsCache.DB_NAME, TsCache.DB_VERSION);
            await this.clearExpiredStorage();
        }
        return this.#database;
    }

    /**
     * @returns {Promise<IDBDatabase>}
     */
    static async #openDB(name, version) {
        return new Promise((ok, err) => {
            const request = indexedDB.open(name, version);

            request.onsuccess = (event) => {
                ok(event.target.result);
            };

            request.onerror = (event) => {
                err(event.target.error);
            };

            request.onupgradeneeded = function (event) {
                const db = event.target.result;
                const objectStore = db.createObjectStore(TsCache.STORE_NAME, {keyPath: "key"});

                objectStore.createIndex(TsCache.DATE_INDEX, "cacheDate");
            };
        });
    }

    /** @arg request {IDBRequest} */
    static async #select(request) {
        return new Promise((ok, err) => {
            request.onsuccess = (event) => {
                const data = event.target.result;
                if (data) {
                    ok(data);
                } else {
                    ok(undefined);
                }
            }

            request.onerror = (event) => {
                err(new Error(event.target.error));
            }
        })
    }

    /** @arg request {IDBRequest} */
    static async #update(request) {
        return new Promise((ok, err) => {
            request.onsuccess = () => {
                ok()
            }
            request.onerror = (event) => {
                err(new Error(event.target.error));
            }
        })
    }

    async get(key, asyncValueProvider) {
        const db = await this.#getDB();

        const tx = db.transaction([TsCache.STORE_NAME], "readonly");
        const store = tx.objectStore(TsCache.STORE_NAME);
        const cached = await TsCache.#select(store.get(key));

        if (cached !== undefined) {
            return cached.value;
        }

        const value = await asyncValueProvider();
        if (value === undefined) return;

        const cacheDate = new Date();

        // первая tx могла закрыться: кто знает что там в asyncValueProvider?
        const tx2 = db.transaction([TsCache.STORE_NAME], "readwrite");
        const store2 = tx2.objectStore(TsCache.STORE_NAME);
        await TsCache.#update(store2.add({key, cacheDate, value}));

        return value;
    }

    /**
     * Removes from cache all the expired entries
     */
    async clearExpiredStorage() {
        const db = await this.#getDB();
        const tx = db.transaction([TsCache.STORE_NAME], "readwrite");
        const store = tx.objectStore(TsCache.STORE_NAME);

        const idx = store.index(TsCache.DATE_INDEX);

        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 7);
        const range = IDBKeyRange.upperBound(endDate);

        /** @type number[] */
        const expiredKeys = await TsCache.#select(idx.getAllKeys(range));

        await Promise.all(expiredKeys.map(key =>
            TsCache.#update(store.delete(key))
        ))
    }

}

// noinspection DuplicatedCode
class CustomTsHost {
    tsUrl;
    tsSourceFiles;
    jsOutput = new Map();

    constructor(tsUrl, tsSourceFiles) {
        this.tsUrl;
        this.tsSourceFiles = tsSourceFiles;
    }

    getSourceFile(url) {
        try {
            if (!this.tsSourceFiles[url]) {
                this.#fetchLib(url);
            }
            return this.tsSourceFiles[url];
        } catch (err) {
            console.error(`Failed to load ${url}:`, err);
            return undefined;
        }
    }

    getDefaultLibFileName() {
        return ""
    }

    writeFile(name, text) {
        this.jsOutput.set(name, text);
    }

    getCurrentDirectory() {
        return global().location.href;
    }

    getDirectories() {
        return []
    }


    fileExists(url) {
        if (url.endsWith("package.json")) return false;
        if (this.tsSourceFiles[url]) return true;
        if (url.indexOf("/node_modules/") !== -1) {
            this.#fetchLib(url);
        }
        return this.tsSourceFiles[url] !== undefined;
    }

    readFile(url) {
        throw new Error("asdasd");
    }

    getCanonicalFileName(fileName) {
        return fileName;
    }

    useCaseSensitiveFileNames() {
        return true;
    }

    getNewLine() {
        return "\n";
    }

    trace(...args) {
        // console.debug(...args);
    }

    #fetchLib(url) {
        const fileName = url.replaceAll(/.*\//g, "")
            .replace("-", ".")
            .toLowerCase();
        if (!TS_LIBS_REGISTER.includes(fileName)) return;
        const libUrl = "https://cdn.jsdelivr.net/npm/typescript@5.9.3/lib/" + fileName;
        const response = this.#fetch(libUrl);
        if (response.status >= 400) {
            return;
        }
        this.tsSourceFiles[url] = self.ts.createSourceFile(
            url, response.responseText,
            self.ts.ScriptTarget.ES2020,
            true
        );
    }

    #fetch(url) {
        const req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.send();
        return req;
    }
}

class TsModule {
    /** @type {ts} */
    static tsNamespace = null;

    #prodMode;
    #tsUrl;

    constructor(tsUrl, prodMode) {
        this.#prodMode = prodMode;
        this.#tsUrl = tsUrl;
    }

    async getTs() {
        if (TsModule.tsNamespace !== null) {
            return TsModule.tsNamespace;
        }
        return TsModule.tsNamespace = await this.#prepareTypeScriptCompiler();
    }

    async createTsSource(url, src) {
        const ts = await this.getTs();
        return ts.createSourceFile(
            url, src,
            ts.ScriptTarget.ES2020,
            true
        );
    }

    async #prepareTypeScriptCompiler() {
        return new Promise((resolve) => {
            if (ts()) resolve(ts());
            else {
                fetch(this.#tsUrl)
                    .then(resp => resp.text())
                    .then(text => {
                        const gEval = eval; // I'm too lazy to make it properly for now
                        gEval(text);
                    })
                    .then(() => {
                        resolve(ts())
                    })

            }
        })
    }

    async compileSources(entryModuleUrl, tsSources) {
        const ts = await this.getTs();
        const compilerOptions = {
            target: ts.ScriptTarget.ES2017,
            module: ts.ModuleKind.ES2020,
            moduleResolution: ts.ModuleResolutionKind.Classic,
            removeComments: false,
            newLine: ts.NewLineKind.LineFeed,
            preserveConstEnums: true,
            sourceRoot: entryModuleUrl.replace(/\/[^\/]+$/, '/'),
            sourceMap: true,
            inlineSourceMap: true,
            inlineSources: true,
            declaration: false,
            emitDeclarationOnly: false,
            noEmitOnError: false,
            allowImportingTsExtensions: true,
            traceResolution: true,
            lib: this.#prodMode ? [] : ["lib.es2020", "lib.dom"],
            typeRoots: ["https://cdn.jsdelivr.net/npm/typescript@5.9.3/lib/"]
        };

        const host = new CustomTsHost(this.#tsUrl, tsSources);

        const program = ts.createProgram(
            [entryModuleUrl],
            compilerOptions,
            host
        );

        const emitResult = program.emit();

        if (!this.#prodMode) {
            const diagnostics = ts.getPreEmitDiagnostics(program);

            diagnostics.forEach(diagnostic => {
                if (diagnostic.file) {
                    const {line, character} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");

                    const errorText = `Error: ${message}\n    at <anonymous> (${diagnostic.file.path}:${line + 1}:${character + 1})`
                    const error = new Error(message);
                    error.stack = errorText;

                    if (diagnostic.category === 1) {
                        new Promise(() => {
                            throw error;
                        })
                    } else {
                        console.debug(formatted);
                    }

                } else {
                    // console.error(TsModule.tsNamespace.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
                }
            });
        }

        return host.jsOutput;
    }
}

export class ezTS {

    static async compile(entryPointUrl, tsUrl, prodMode) {
        const tsSourceFiles = await ezTS.findRecursiveImports(entryPointUrl);

        const hash = Hash.hash(Array.from(tsSourceFiles.entries()));
        return await new TsCache().get(hash, async () => {
            const tsModule = new TsModule(tsUrl, prodMode);
            const tsSources = await ezTS.#createTsSources(tsSourceFiles, tsModule);
            const compilerOutput = await tsModule.compileSources(entryPointUrl, tsSources);
            const jsOutput = ezTS.#replaceJsExt(compilerOutput);
            return jsOutput;
        })
    }

    static #replaceJsExt(filesMap) {
        const output = new Map();
        filesMap.forEach((src, name) => {
            const fixed = src.replaceAll(/((?:import|export).*)\.ts(['"])/g, "$1.js$2");
            output.set(name, fixed);
        });
        return output;
    }

    static async #createTsSources(sources, tsModule) {
        const result = {};
        for (let [k, v] of sources.entries()) {
            result[k] = await tsModule.createTsSource(k, v);
        }
        return result;
    }

    static resolveUrl(parent, child) {
        const parentUrl = new URL(parent);
        const resolved = new URL(child, parentUrl);
        return resolved.href;
    }

    static async loadFile(url) {
        const file = await fetch(url);
        return await file.text()
    }

    static async findRecursiveImports(url, importsCollector = new Map()) {
        if (importsCollector.has(url)) return importsCollector;

        const src = await this.loadFile(url);
        importsCollector.set(url, src);

        const fileImports = this.findImportsInSource(url, src);

        for (let newImport of fileImports) {
            await ezTS.findRecursiveImports(newImport, importsCollector);
        }

        return importsCollector;
    }

    /**
     * @param url {string}
     * @param src {string}
     */
    static findImportsInSource(url, src) {
        const staticImports = src.matchAll(/^(^\s*(?:import|export).*from\s+["'])([^"']+\.ts)(["'])/gm);
        const dynamicImports = src.matchAll(/(\s+import\s*\(\s*["'])([^"']+\.ts)(["']\s*\))/gs);

        /** @type {RegExpExecArray[]} */
        const allImports = [].concat([...staticImports]).concat([...dynamicImports]);
        const result = allImports
            .map(i => i[2])
            .map(i => ezTS.resolveUrl(url, i));

        return result;
    }

}