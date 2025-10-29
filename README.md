# ezTS

Lightweight JS library for TypeScripting without a node-js stack.

## Requirements

Browser with ECMAScript 6 (ES-2015) support.
Access to https://cdn.jsdelivr.net/ or providing local copy of a TypeScript compiler.

## Features

### EntryPoint

You can directly use the `ezTS` class to load the necessary TypeScript modules, but there's a simpler way: define a
global variable named `ezTS_main`, which specifies the name of the main TypeScript module file.
This will automatically call its main() method.

### Zero Dependency

All the code is in the project, except for the TypeScript compiler itself.

### No module scripts in the html

`ezTS` uses browser `importmap` functionality to replace actual server-side `.ts` files with compiled `.js` ones.
But changing the `importmap` is prohibited after any ESM module has been loaded.
This means that `script type="module"` and `ezTS` will not work together.
However, if you create a global function named `ezTS_ready`, it will be called immediately after changing
the `importmap`. You can dynamically import everything you need in this function.

### No dynamic TS imports

During compilation, TS source files are checked for dependencies at the beginning of the file, and if so, they are also
loaded and compiled. However, if a dynamic import statement is present, the loader will not be able to load the
corresponding TS source file.

## Showcase

You can try https://friendlyted.github.io/ezTS/showcase/simple/index.html to see how it works.
