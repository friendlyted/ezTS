# ezTS

Lightweight JS library for TypeScripting without a node-js stack.

## Requirements

- Browser with ECMAScript 6 (ES-2015) support.
- Browser Web Workers (module mode) support.
- Browser Service Workers support.
- Access to https://cdn.jsdelivr.net/ or providing local copy of a TypeScript compiler.

## Details

The TS compiler process files in blocking mode.
To prevent the page from freezing during this time, the compiler is placed in a separate thread — a JS web worker.

The compiled JS files are "supplied" to the page so that it thinks it's receiving files from the server.
This is accomplished using a JS service worker that intercepts fetch requests.

## Usage

For browser security reasons, worker source files must be placed in the application path.
This means that you need to create 2 JS files that will simply reference the library ones.

web-worker.js:

```javascript
import {} from "https://friendlyted.github.io/ezTS/loader/web-worker.js";
```

service-worker.js:

```javascript
importScripts("https://friendlyted.github.io/ezTS/loader/service-worker.js");
```

In your page, add initial code:

```html
<script type="module">
    import {ezStartTS} from "https://friendlyted.github.io/ezTS/loader/front.js";

    ezStartTS({
        serviceWorker: "./service-worker.js",
        webWorker: "./web-worker.js",
        entryPointFile: "./index.ts",
        entryPointFunction: "main"
    })
</script>
```

Or, if you use classic JS:

```html
<script type="text/javascript">
    import("https://friendlyted.github.io/ezTS/loader/front.js")
        .then(ez => ez.ezStartTS({
            serviceWorker: "./service-worker.js",
            webWorker: "./web-worker.js",
            entryPointFile: "./index.ts",
            entryPointFunction: "main"
        }));
</script>
```

## Zero Dependency

All the code is in the project, except for the TypeScript compiler itself.

## Showcase

You can try https://friendlyted.github.io/ezTS/showcase/simple/index.html to see how it works.
