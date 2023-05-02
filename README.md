# 🌍 minecraft-server-banner-generator

Module to generate images of Minecraft-like banners with information about a server.

![Default banner](https://i.imgur.com/Cbk0Ibi.png)
![Hypixel banner](https://i.imgur.com/p0kIk1m.png)
![Minemen banner](https://i.imgur.com/wrKmMmg.png)
![Lunar banner](https://i.imgur.com/lWEmKP1.png)
![Bedwars Practice](https://i.imgur.com/gwODaCc.png)

# Usage

1. First, import the module:

    ```js
    // Using CommonJS
    const { generate } = require("minecraft-server-banner-generator");

    // Using TypeScript or ESM
    import { generate } from "minecraft-server-banner-generator";
    ```

2. Then, call the `generate` function by passing the information for the banner:

    ```ts
    // Using HyCraft information
    const options = {
        name: "HyCraft",
        players: {
            online: 721,
            max: 5000
        },
        motd: "§a§lHYCRAFT §f§lNETWORK §8» §7[1.7 1.19]\n§f§lSpeed SkyWars §8▸ §6¡Nuevo modo de SkyWars!§r",
        favicon: Buffer.from(
            "iVBORw0KGgoAAAANSUhEUg...",
            "base64"
        )
    }

    // Using promises
    generate(options).then(image => {
        writeFileSync(path.join(__dirname, "banner.png"), image);
    });

    // Using async/await
    const image = await generate(options);
    writeFileSync(path.join(__dirname, "banner.png"), image);
    ```
    Generated:
    
    ![HyCraft](https://i.imgur.com/GJCSlmo.png)
# API

```ts
generate(options: BannerGeneratorOptions) => Promise<Buffer>
```
Generate a banner of a Minecraft server. Returns a `Promise` with the banner as a `Buffer`, or throws an error if something happened while generating the image.

- options.name (`string`): Name that's going to appear at the top of the banner as the server name.
- options.players (optional, `{ max?: number, online?: number }`): Amount of players that's going to appear at the top right corner of the banner. Defaults to `{ max: 0, online: 0 }`.
- options.motd (optional, `string`): MOTD (Message of the day) of the server. Appears under the server name. Defaults to: `§7A Minecraft Server`.
- options.favicon (optional, `Buffer`): Favicon of the server as a buffer. Appears at the left of the banner. Defaults to the default Minecraft server favicon.
- options.mimeType (optional, `image/png` or `image/jpeg`): Favicon of the server as a buffer. Appears at the left of the banner Defaults to `image/png`.