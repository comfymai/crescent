import { Module } from "@nestjs/common";

import { NecordModule } from "necord";
import { GatewayIntentBits } from "discord.js";
import { DiscordModule } from "./discord/discord.module";
import { MiscModule } from "./misc/misc.module";
import { RandomModule } from "./random/random.module";

@Module({
    imports: [
        NecordModule.forRoot({
            token: process.env.BOT_TOKEN ?? "",
            intents: [GatewayIntentBits.Guilds],
        }),
        DiscordModule,
        MiscModule,
        RandomModule
    ],
})
export class AppModule {}
