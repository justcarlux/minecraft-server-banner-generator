import { createCanvas, loadImage } from "canvas";
import * as assets from "./assets";
import { MotdColorCodesHex } from "./motd";
import { motdToArray } from "./utils";

/**
 * Options for the generator
 * @interface BannerGeneratorOptions
*/
export interface BannerGeneratorOptions {
    /** Name that's going to appear at the top of the banner as the server name */
    name: string,
    /** Amount of players that's going to appear at the top right corner of the banner. Defaults to `{ max: 0, online: 0 }` */
    players?: {
        max?: number,
        online?: number
    },
    /** MOTD (Message of the day) of the server. Appears under the server name. Defaults to: `§7A Minecraft Server` */
    motd?: string,
    /** Favicon of the server as a buffer. Appears at the left of the banner. Defaults to the standard Minecraft server favicon */
    favicon?: Buffer,
    /** Banner image buffer mime type. Defaults to `image/png` */
    mimeType?: "image/png" | "image/jpeg"
}

/**
 * Generate a banner of a Minecraft server. Returns a `Promise` with the banner as a `Buffer`, or throws an error if something happened while generating the image.
 * @param {options} BannerGeneratorOptions The result ID from where you want to get information
 * @returns {Promise<Buffer>} The banner image (in PNG) according to the *mimeType* specified as a Buffer. Throws an error if something happens while generating the banner
*/
async function generate(options: BannerGeneratorOptions): Promise<Buffer> {

    // Create canvas
    const canvas = createCanvas(1368, 176);
    const ctx = canvas.getContext("2d");

    // Load favicon
    const favicon = options.favicon ?
    await loadImage(options.favicon) :
    await loadImage(assets.images.get("default_server_icon") as Buffer);
    if (!favicon || favicon instanceof Buffer) throw new Error("Favicon loading error (invalid Image instance).");

    // Load and draw background
    const background = await loadImage(assets.images.get("server_banner_background") as Buffer);
    if (!background || background instanceof Buffer) throw new Error("Background loading error (invalid Image instance).");
    ctx.drawImage(background, 0, 0);

    // Draw favicon without smoothing
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(favicon, 24, 24, 128, 128);
    ctx.imageSmoothingEnabled = true;
    
    // Set default font
    ctx.font = "40px minecraftia, code2000";

    // Draw max players count
    ctx.textAlign = "right";
    let playersX = 1284;
    ctx.fillStyle = MotdColorCodesHex.gray;
    ctx.fillText((options.players?.max ?? 0).toString(), playersX, 78);
    playersX -= ctx.measureText((options.players?.max ?? 0).toString()).width + 3;

    // Draw slash separator for online and max players
    ctx.fillStyle = MotdColorCodesHex.dark_gray;
    ctx.fillText("/", playersX, 78);
    playersX -= ctx.measureText("/").width + 3;

    // Draw online players count
    ctx.fillStyle = MotdColorCodesHex.gray;
    ctx.fillText((options.players?.online ?? 0).toString(), playersX, 78);

    // Draw server title
    ctx.textAlign = "left";
    ctx.fillStyle = MotdColorCodesHex.white;
    ctx.fillText(options.name, 176, 78);

    // Parse and draw server motd
    const motd = (options.motd?.trim() || "§7A Minecraft Server").split(/\r?\n/).map(e => motdToArray(e));
    motd.forEach((line, lineIndex) => {

        let x = 176;
        let y = 133 + (lineIndex * 50);
        let styleContext: string[] = [];

        line.forEach((linePart) => {

            const reset = () => {
                ctx.font = "40px minecraftia, code2000";
                styleContext = [];
            }

            if (linePart.isColor) {
                if (linePart.text === " ") reset();
                ctx.fillStyle = MotdColorCodesHex[linePart.code as keyof typeof MotdColorCodesHex];
            } else {
                if (linePart.code === "bold") ctx.font = "bold 40px minecraftia, code2000";
                if (linePart.code === "italic") ctx.font = "italic 40px minecraftia, code2000";
                if (
                    linePart.code === "underlined" ||
                    linePart.code === "strikethrough" ||
                    linePart.code === "obfuscated"
                ) styleContext.push(linePart.code);
                if (
                    linePart.code === "reset" ||
                    linePart.text === " "
                ) reset();
            }
            
            if (!linePart.text) return;

            if (styleContext.includes("obfuscated")) {
                linePart.text = linePart.text.split("").map(char => {
                    if (!char.trim()) return char;
                    return String.fromCharCode(Math.floor(Math.random() * ((127) - 33) + 33));
                }).join("");
            }

            const { width, actualBoundingBoxDescent } = ctx.measureText(linePart.text);
            const isFallback = actualBoundingBoxDescent > -8;

            if (styleContext.includes("strikethrough")) ctx.fillRect(x, y - 40, width, 4);
            if (styleContext.includes("underlined")) ctx.fillRect(x, y - 21, width, 4);

            ctx.fillText(
                linePart.text,
                (linePart.code === "italic") ? x - (isFallback ? 9 : 6) : x - (isFallback ? 2 : 0),
                isFallback ? y - 29 : y
            );
            
            x += width + (linePart.code === "italic" ? 5 : 0);

        });

    });

        // Return buffer as a promise (to not block the thread)
    if (!options.mimeType || options.mimeType === "image/png") {
        return await new Promise<Buffer>((resolve, reject) => {
            canvas.toBuffer((err, buf) => {
                if (err) reject(err);
                resolve(buf);
            }, "image/png")
        });
    } else {
        return await new Promise<Buffer>((resolve, reject) => {
            canvas.toBuffer((err, buf) => {
                if (err) reject(err);
                resolve(buf);
            }, "image/jpeg")
        });
    }

}

export { generate };

