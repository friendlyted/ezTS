import {importTS, installSW} from "../../loader/front.js";
await installSW("sw.js");

const mainModule = await importTS("ts/main_module.ts");
mainModule.main();