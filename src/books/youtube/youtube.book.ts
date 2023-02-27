import { Module } from "@nestjs/common";
import { YoutubeSpells } from "./spells";

@Module({
    providers: [YoutubeSpells],
    exports: [YoutubeSpells],
})
export class YoutubeBook {}
