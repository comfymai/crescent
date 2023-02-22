import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { NecordModule } from "necord";
import { GatewayIntentBits } from "discord.js";
import { DiscordModule } from "./discord/discord.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        NecordModule.forRoot({
            token: process.env.BOT_TOKEN ?? "",
            intents: [GatewayIntentBits.Guilds],
        }),
        DiscordModule
    ],
})
export class AppModule {}
