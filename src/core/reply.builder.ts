import { Nullable } from "@app/helpers/types";
import { EmbedOptions, EmbedService } from "@app/core/embed.service";
import { InteractionReplyOptions } from "discord.js";

export class ReplyBuilder {
    public static create(): ReplyBuilder {
        return new ReplyBuilder();
    }

    public ephemeral: boolean;
    public content: Nullable<string>;
    public embeds: EmbedOptions[];

    constructor() {
        this.ephemeral = false;
        this.content = null;
        this.embeds = [];
    }

    public setEphemeral(ephemeral = true) {
        this.ephemeral = ephemeral;
        return this;
    }

    public setContent(content: Nullable<string>) {
        this.content = content;
        return this;
    }

    public addEmbed(embed: EmbedOptions) {
        this.embeds.push(embed);
        return this;
    }

    public addWarning(embed: Omit<EmbedOptions, "color">) {
        this.embeds.push({
            ...embed,
            color: "warning",
        });
        return this;
    }

    public addError(embed: Omit<EmbedOptions, "color">) {
        this.embeds.push({
            ...embed,
            color: "error",
        });
        return this;
    }

    public addSuccess(embed: Omit<EmbedOptions, "color">) {
        this.embeds.push({
            ...embed,
            color: "success",
        });
        return this;
    }

    public build(): InteractionReplyOptions {
        return {
            ephemeral: this.ephemeral,
            embeds: this.embeds.map(EmbedService.create),
            content: this.content ?? undefined,
        };
    }
}
