import { Module } from "@nestjs/common";
import { RandomCommands } from "./random.commands";

@Module({
    providers: [RandomCommands],
    exports: [RandomCommands]
})
export class RandomModule {}
