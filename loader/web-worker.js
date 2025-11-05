import {ezTS} from "./ezTS.js";

export class WebWorkerBackend {
    #functions;
    #worker;

    constructor(worker, functions = new Map()) {
        this.#worker = worker;
        this.#functions = functions;
    }

    add(code, fn) {
        this.#functions.set(code, fn);
        return this;
    }

    attach() {
        self.addEventListener(
            "message",
            (event) => this.onMessage(event)
        );
        return this;
    }

    onMessage(event) {
        const data = event.data;
        const type = data.type;
        const id = data.id;

        if (!this.#functions.has(type)) {
            const error = new Error(`There is no worker function for type ${type}`)
            this.responseException(id, type, error)
        } else {
            const targetFn = this.#functions.get(type);
            let result;
            try {
                result = targetFn(...data.args);
            } catch (ex) {
                this.responseException(id, type, ex);
                return;
            }

            if (result instanceof Promise) {
                result
                    .then(r => this.#worker.postMessage({id, type, result: r}))
                    .catch(ex => this.responseException(id, type, ex));
            } else {
                this.#worker.postMessage({id, type, result});
            }
        }
    }

    responseException(id, type, ex) {
        this.#worker.postMessage({
            id,
            type,
            exception: true,
            name: ex.name,
            message: ex.message,
            stack: ex.stack
        });
    }
}

new WebWorkerBackend(self)
    .attach()
    .add("COMPILE_TS", compileTs)


async function compileTs(baseUrl, entryPointUrl) {
    const entryPointAbsoluteUrl = ezTS.resolveUrl(baseUrl, entryPointUrl);
    const sources = await ezTS.compile(entryPointAbsoluteUrl);

    return sources;
}
