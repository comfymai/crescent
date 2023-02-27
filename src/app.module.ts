import { Module } from "@nestjs/common";

import { NecordModule } from "necord";
import { GatewayIntentBits } from "discord.js";

import { DiscordModule } from "./discord/discord.module";
import { YoutubeBook } from "./books/youtube/youtube.book";
import { MiscBook } from "./books/misc/misc.book";
import { RandomBook } from "./books/random/random.book";

@Module({
    imports: [
        NecordModule.forRoot({
            token: process.env.BOT_TOKEN ?? "",
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildVoiceStates,
            ],
        }),
        DiscordModule,
        MiscBook,
        RandomBook,
        YoutubeBook,
    ],
})
export class AppModule {}
