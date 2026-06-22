import breeds from "./breeds.js";

export function readBreads() {
    return breeds;
}

export function addBreed(breedName) {
    const neewBreed = {
        id: breeds.length + 1,
        name: breedName
    }
    breeds.push(neewBreed);
}