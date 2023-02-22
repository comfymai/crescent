import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GatewayIntentBits } from "discord.js";
import { NecordModule } from "necord";

@Module({
    imports: [
        ConfigModule.forRoot(),
        NecordModule.forRoot({
            token: process.env.BOT_TOKEN ?? "",
            intents: [GatewayIntentBits.Guilds],
        }),
    ],
})
export class AppModule {}
