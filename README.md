# ezTS

Lightweight JS library for TypeScripting without a node-js stack.

## Requirements

- Browser with ECMAScript 6 (ES-2015) support.
- Access to https://cdn.jsdelivr.net/ or providing local copy of a TypeScript compiler.

## Features

- ### EntryPoint

You can directly use the `ezTS` class to load the necessary TypeScript modules, but there's a simpler way: define a
global variable named `ezTS_main` (or `window["ezTS_main"]`), which specifies the name of the main TypeScript module file.
This will automatically call its main() method.

- ### Debugger

TS sources are available for debugging, but they loaded so quickly that the browser debugger may not have time to set
breakpoints, so a pause may be required before executing the TS code itself. To do this, you can set the 
variable `ezTS_wait_for_debugger = true` (or `window["ezTS_wait_for_debugger"] = true`).

- ### Zero Dependency

All the code is in the project, except for the TypeScript compiler itself.

## Usage

- ### EntryPoint using JS module
```html
<body>
    <script type="text/javascript" src="https://friendlyted.github.io/ezTS/loader/ezTS.js"></script>
    <script type="module">
        window["ezTS_main"] = "./my_ts_module.ts";
        window["ezTS_wait_for_debugger"] = true;
    </script>
</body>
```

- ### EntryPoint using plain JS
```html
<body>
    <script type="text/javascript" src="https://friendlyted.github.io/ezTS/loader/ezTS.js"></script>
    <script type="text/javascript">
        ezTS_main = "./my_ts_module.ts";
        ezTS_wait_for_debugger = true;
    </script>
</body>
```
- ### Using explicitly ezTS class
```html
<body>
    <script type="text/javascript" src="https://friendlyted.github.io/ezTS/loader/ezTS.js"></script>
    <script type="text/javascript">
        (async () => {
            let [loadedTsModule] = await ezTS.import({
                tsUrl: "https://cdn.jsdelivr.net/npm/typescript@5.9.3/lib/typescript.min.js",
                modules: ["./my_ts_module.ts"]
            });
            
            // maybe your debugger wants to take a rest
            // await new Promise(resolve => setTimeout(resolve, 300));
            loadedTsModule.myTsFunction();
        })();
    </script>
</body>
```


## Showcase

You can try https://friendlyted.github.io/ezTS/showcase/simple/index.html to see how it works.
