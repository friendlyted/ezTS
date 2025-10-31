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

## Showcase

You can try https://friendlyted.github.io/ezTS/showcase/simple/index.html to see how it works.
