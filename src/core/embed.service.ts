import { embedConfig } from "@app/config/embed.config";
import { ColorResolvable, EmbedBuilder } from "discord.js";

export interface EmbedOptions {
    title?: string;
    description: string;
    color?: keyof (typeof embedConfig)["colors"];
}

export class EmbedService {
    public static create(options: EmbedOptions) {
        const { title, description } = options;
        const color = embedConfig.colors[
            options.color ?? "default"
        ] as ColorResolvable;

        const embed = new EmbedBuilder();
        embed.setTitle(title ?? null);
        embed.setDescription(description);
        embed.setColor(color);

        return embed;
    }
}
