import {swFrontend} from "https://friendlyted.github.io/swFn/swFrontend.js";

if (!navigator.serviceWorker.controller) {
    console.warn("Hard Reloading detected! Browser disabled service workers for the current page, so we'll need to reload page as usual.")
    window.location.reload();
}

const swReg = await navigator.serviceWorker.register("./back.js", {type: "module"});

await new Promise(ok => {
    swReg.addEventListener("active", () => ok());
    setTimeout(() => {
        if (swReg.active) ok()
    }, 0);
})

async function compileTs(url, main) {
    return await swFrontend("COMPILE_TS", url, main);
}

async function addMockFiles(files) {
    return await swFrontend("ADD_MOCK_FILES", files);
}

const jsFiles = await compileTs(window.location.href, "../simple/main_module.ts");
await addMockFiles(jsFiles);

const module = await import("../simple/main_module.js");
if (typeof module["main"] === "function") {
    module["main"]();
}