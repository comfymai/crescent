import { Module } from "@nestjs/common";
import { SessionManager } from "./session.manager";
import { YoutubeSpells } from "./spells";
import { PlaybackSpells } from "./spells/playback";

@Module({
    providers: [SessionManager, YoutubeSpells, PlaybackSpells],
    exports: [YoutubeSpells],
})
export class YoutubeBook {}
