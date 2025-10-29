import {doubleIt} from "./another_module.ts";

export function main() {
    const src = 123;
    const result = doubleIt(src);
    const text = document.createElement("h3");
    text.textContent = `The result of doubling ${src} is ${result}`;
    document.body.appendChild(text)
}