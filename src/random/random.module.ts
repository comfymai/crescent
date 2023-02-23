import { Module } from "@nestjs/common";
import { RandomCommands } from "./commands";

@Module({
    providers: [RandomCommands],
    exports: [RandomCommands]
})
export class RandomModule {}
