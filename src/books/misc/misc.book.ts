import { Module } from "@nestjs/common";
import { MiscSpells } from "./spells";

@Module({
    providers: [MiscSpells],
    exports: [MiscSpells]
})
export class MiscBook {}
