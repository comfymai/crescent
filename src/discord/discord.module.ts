import { Module } from "@nestjs/common";
import { LifetimeListener } from "./listeners/lifetime.listener";

@Module({
    providers: [LifetimeListener]
})
export class DiscordModule {}
