import breeds from "./breeds.js";

export function readBreads() {
    return breeds;
}

export function addBreed(breedName) {
    //TODO: Generate unique id for new breed
    const neewBreed = {
        id: breeds.length + 1,
        name: breedName
    }
    breeds.push(neewBreed);
}