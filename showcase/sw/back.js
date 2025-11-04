import {SwBackend} from "https://friendlyted.github.io/swFn/swBackend.js";
import {ezTS} from "../../loader/ezTS2.js";

async function compileTs(baseUrl, entryPointUrl){
    const entryPointAbsoluteUrl = ezTS.resolveUrl(baseUrl, entryPointUrl);
    return await ezTS.compile(entryPointAbsoluteUrl);
}

new SwBackend(self)
    .attach()
    .add("COMPILE_TS", compileTs)
