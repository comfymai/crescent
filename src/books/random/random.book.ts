import { Module } from "@nestjs/common";
import { RandomSpells } from "./spells";

@Module({
    providers: [RandomSpells],
    exports: [RandomSpells]
})
export class RandomBook {}
