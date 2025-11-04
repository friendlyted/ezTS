import {SwBackend} from "https://friendlyted.github.io/swFn/swBackend.js";
import {ezTS} from "../../loader/ezTS2.js";

async function compileTs(baseUrl, entryPointUrl) {
    const entryPointAbsoluteUrl = ezTS.resolveUrl(baseUrl, entryPointUrl);
    return await ezTS.compile(entryPointAbsoluteUrl);
}

async function fileResponse(content) {
    return new Response(content, {
        headers: {
            'Content-Type': 'application/javascript'
        }
    });
}

let mockFiles = new Map();
self.addEventListener('fetch', event => {
    const url =  event.request.url;
    if(url.endsWith("main_module.js")){
        console.log("main_module.js is fetching...");
    }
    if (mockFiles.has(url)) {
        event.respondWith(fileResponse(mockFiles.get(url)));
    }
});
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Forces the new Service Worker to take control immediately
});
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim()); // Ensures the Service Worker takes control of all open clients
});

/**
 *
 * @param files {Map<string, string>}
 * @returns {Promise<void>}
 */
async function addMockFiles(files) {
    files.forEach((src,name)=>{
        mockFiles.set(name, src);
    });
}

new SwBackend(self)
    .attach()
    .add("COMPILE_TS", compileTs)
    .add("ADD_MOCK_FILES", addMockFiles)

