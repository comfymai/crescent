import { Logger } from "@nestjs/common";

export class Spark {
    protected readonly logger: Logger

    constructor() {
        this.logger = new Logger(Spark.name)
    }
}
