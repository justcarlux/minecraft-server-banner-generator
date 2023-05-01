import { MotdColorCodes, MotdFormatCodes } from "./motd";

interface MotdPart {
    text: string,
    isColor: boolean,
    code: typeof MotdColorCodes[keyof typeof MotdColorCodes] | typeof MotdFormatCodes[keyof typeof MotdFormatCodes];
}

export function motdToArray(motd: string, useAmpersand?: boolean): MotdPart[] {

    const result: MotdPart[] = [];
    `§r${motd}`.split(useAmpersand ? "&" : "§").filter(e => e).forEach((part) => {
        let code: MotdPart["code"] = MotdColorCodes[part[0] as keyof typeof MotdColorCodes];
        let isColor = true;
        if (!code) {
            code = MotdFormatCodes[part[0] as keyof typeof MotdFormatCodes];
            isColor = false;
        }
        result.push({ code, isColor, text: "" })
        part.slice(1).split("").forEach(text => { result.push({ code, isColor, text }); });
    });

    return result;

}