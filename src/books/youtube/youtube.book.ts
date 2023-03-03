import { Module } from "@nestjs/common";
import { SessionManager } from "./session.manager";
import { SessionSpells } from "./spells/session"
import { PlaybackSpells } from "./spells/playback";

@Module({
    providers: [SessionManager, SessionSpells, PlaybackSpells],
    exports: [SessionSpells, PlaybackSpells],
})
export class YoutubeBook {}
