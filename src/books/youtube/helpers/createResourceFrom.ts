import { createAudioResource } from "@discordjs/voice";
import * as ytdl from "ytdl-core"

export function createResourceFrom(url: string) {
        const stream = ytdl(url, { filter: "audioonly", dlChunkSize: 0 });
        return createAudioResource(stream);
}
