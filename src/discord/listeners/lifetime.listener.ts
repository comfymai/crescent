import { Injectable, Logger } from "@nestjs/common";
import { Context, ContextOf, On, Once } from "necord";

@Injectable()
export class LifetimeListener {
    private logger = new Logger(LifetimeListener.name)

    @Once("ready")
    public handleReady(@Context() [context]: ContextOf<"ready">) {
        this.logger.log(`ready as "${context.user.tag}"!`)
    }

    @On("error")
    public handleError(@Context() [error]: ContextOf<"error">) {
        this.logger.error(`received an error: ${error}`)
    }

    @On("warn")
    public handleWarn(@Context() [warn]: ContextOf<"warn">) {
        this.logger.warn(`received a warning: ${warn}`)
    }
}
