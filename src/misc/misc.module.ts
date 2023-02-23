import { Module } from "@nestjs/common";
import { MiscCommands } from "./commands";

@Module({
    providers: [MiscCommands],
    exports: [MiscCommands]
})
export class MiscModule {}
