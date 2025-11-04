import {swFrontend} from "https://friendlyted.github.io/swFn/swFrontend.js";

export async function installSW(url){
    if (!navigator.serviceWorker.controller) {
        console.warn("Hard Reloading detected! Browser disabled service workers for the current page, so we'll need to reload page as usual.")
        window.location.reload();
    }

    const swReg = await navigator.serviceWorker.register(url, {type: "module"});

    await new Promise(ok => {
        swReg.addEventListener("active", () => ok());
        setTimeout(() => {
            if (swReg.active) ok()
        }, 0);
    })
}

export async function importTS(main) {
    await swFrontend("COMPILE_TS", window.location.href, main);
    const mainUrl = new URL(main.replace(".ts", ".js"), new URL(window.location.href));
    return import(mainUrl);
}
