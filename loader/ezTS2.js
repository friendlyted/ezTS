// noinspection DuplicatedCode
class CustomTsHost {
    tsSourceFiles;
    jsOutput = {};

    constructor(tsSourceFiles) {
        this.tsSourceFiles = tsSourceFiles;
    }

    getSourceFile(fileName) {
        try {
            return this.tsSourceFiles[fileName];
        } catch (err) {
            console.error(`Failed to load ${fileName}:`, err);
            return undefined;
        }
    }

    getDefaultLibFileName() {
        return ""
    }

    writeFile(name, text) {
        this.jsOutput[name] = text;
    }

    getCurrentDirectory() {
        return window.location.href;
    }

    getDirectories() {
        return []
    }

    fileExists(fileName) {
        return true
    }

    readFile(fileName) {
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
}

class TsModule {
    static DEFAULT_TS_URL = "https://cdn.jsdelivr.net/npm/typescript@5.9.3/lib/typescript.min.js";
    /** @type {ts} */
    static tsNamespace = null;

    static async getTs() {
        if (TsModule.tsNamespace !== null) {
            return TsModule.tsNamespace;
        }
        return TsModule.tsNamespace = await TsModule.#prepareTypeScriptCompiler();
    }

    static async createTsSource(url, src) {
        const ts = await TsModule.getTs();
        return ts.createSourceFile(
            url, src,
            ts.ScriptTarget.Latest,
            true
        );
    }


    static async #prepareTypeScriptCompiler() {
        return new Promise((resolve) => {
            if (window["ts"]) resolve(ts);
            else {
                let script = document.createElement("script");
                script.setAttribute("type", "application/javascript");
                script.setAttribute("src", TsModule.DEFAULT_TS_URL);
                script.onload = () => resolve(ts);
                document.body.appendChild(script);
            }
        })
    }

    static async compileSources(entryModuleUrl, tsSources) {
        const ts = await TsModule.getTs();
        const compilerOptions = {
            target: ts.ScriptTarget.ES2017,
            module: ts.ModuleKind.ES2015,
            removeComments: false,
            newLine: ts.NewLineKind.LineFeed,
            preserveConstEnums: true,
            sourceMap: true,
            inlineSourceMap: true,
            inlineSources: true,
            declaration: false,
            emitDeclarationOnly: false,
            noEmitOnError: false
        };

        const host = new CustomTsHost(tsSources);

        const program = ts.createProgram(
            [entryModuleUrl],
            compilerOptions,
            host
        );

        const emitResult = program.emit();
        if (emitResult.emitSkipped) {
            const diagnostics = ts.getPreEmitDiagnostics(program);
            console.error("Compilation errors:");
            diagnostics.forEach(diagnostic => {
                if (diagnostic.file) {
                    const {line, character} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
                    console.error(`(line ${line + 1}, col ${character + 1}): ${message}\n`);
                } else {
                    console.error(TsModule.tsNamespace.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
                }
            });
        } else {
            console.info("Compilation successful!");
        }

        return host.jsOutput;
    }
}

export default class ezTS {

    static async compile(entryPointUrl) {
        const tsSourceFiles = await ezTS.findRecursiveImports(entryPointUrl);
        const tsSources = await this.#createTsSources(tsSourceFiles);
        const output = await TsModule.compileSources(entryPointUrl, tsSources);
        return output;
    }

    static async #createTsSources(sources) {
        const result = {};
        for (let [k, v] of sources.entries()) {
            result[k] = await TsModule.createTsSource(k, v);
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