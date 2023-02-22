import { Module } from "@nestjs/common";
import { MiscCommands } from "./misc.commands";

@Module({
    providers: [MiscCommands],
    exports: [MiscCommands]
})
export class MiscModule {}
