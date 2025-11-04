import {doubleIt} from "./double_module.ts";

export async function main() {
    const src = 123;
    const doubleResult = doubleIt(src);
    const triple = await import("./triple_module.ts");
    const tripleResult = triple.tripleIt(src);

    const text1 = document.createElement("h3");
    text1.textContent = `The result of doubling ${src} is ${doubleResult}`;
    document.body.appendChild(text1)

    const text2 = document.createElement("h3");
    text2.textContent = `The result of tripling ${src} is ${tripleResult}`;
    document.body.appendChild(text2)
}