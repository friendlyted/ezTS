import {swFrontend} from "https://friendlyted.github.io/swFn/swFrontend.js";

await navigator.serviceWorker.register("./back.js", {type: "module"});

async function compileTs(url, main) {
    return await swFrontend("COMPILE_TS", url, main);
}

const result = await compileTs(window.location.href, "../simple/main_module.ts");
console.log("done!")