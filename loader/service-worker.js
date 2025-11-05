const mockFiles = new Map();
self.addEventListener("fetch", event => {
    const url = event.request.url;
    if (mockFiles.has(url)) {
        event.respondWith(fileResponse(mockFiles.get(url)));
    }
});

async function fileResponse(content) {
    return new Response(content, {
        headers: {
            'Content-Type': 'application/javascript'
        }
    });
}

self.addEventListener("message", event => {
    const newFiles = event.data;
    newFiles.forEach((src, name) => {
        mockFiles.set(name, src);
    })
});

