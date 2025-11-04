import {SwBackend} from "https://friendlyted.github.io/swFn/swBackend.js";
import {ezTS} from "./ezTS2.js";

new SwBackend(self)
    .attach()
    .add("COMPILE_TS", compileTs)


let mockFiles = new Map();
self.addEventListener('fetch', event => {
    const url =  event.request.url;
    if (mockFiles.has(url)) {
        event.respondWith(fileResponse(mockFiles.get(url)));
    }
});

export async function compileTs(baseUrl, entryPointUrl) {
    const entryPointAbsoluteUrl = ezTS.resolveUrl(baseUrl, entryPointUrl);
    const sources =  await ezTS.compile(entryPointAbsoluteUrl);

    await addMockFiles(sources);
}

async function addMockFiles(files) {
    files.forEach((src,name)=>{
        mockFiles.set(name, src);
    });
}

async function fileResponse(content) {
    return new Response(content, {
        headers: {
            'Content-Type': 'application/javascript'
        }
    });
}
