import {importTS, installSW} from "../../loader/front.js";

await installSW("sw.js");

const mainModule = await importTS("../simple/main_module.ts");
mainModule.main();