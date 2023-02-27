import { Module } from "@nestjs/common";
import { SessionManager } from "./session.manager";
import { YoutubeSpells } from "./spells";

@Module({
    providers: [YoutubeSpells, SessionManager],
    exports: [YoutubeSpells],
})
export class YoutubeBook {}
