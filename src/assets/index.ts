import { registerFont } from "canvas";
import { readdirSync, readFileSync } from "fs";
import path from "path";

export const images = (() => {
    const loaded = new Map<string, Buffer>();
    readdirSync(path.join(__dirname, "images")).forEach(file => {
        loaded.set(
            path.parse(file).name,
            readFileSync(path.join(__dirname, "images", file))
        )
    });
    return loaded;
})();

readdirSync(path.join(__dirname, "fonts")).forEach(file => {
    const name = path.parse(file).name;
    registerFont(path.join(__dirname, "fonts", file), { family: name });
    registerFont(path.join(__dirname, "fonts", file), { family: `${name}1` });
    // Registering the same font twice with a different family name makes italics
    // and bold styles work. Don't ask me why.
});