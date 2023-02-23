import {
    Context,
    createCommandGroupDecorator,
    Options,
    SlashCommandContext,
    Subcommand,
} from "necord";

import { getDevelopmentGuilds } from "@app/helpers/getDevelopmentGuilds";

import { ChoiceOptions } from "./options/choice";
import { NumberOptions } from "./options/number";

const RandomGroup = createCommandGroupDecorator({
    name: "random",
    description: "A group of commands for randomness.",
    guilds: getDevelopmentGuilds(),
});

@RandomGroup()
export class RandomCommands {
    @Subcommand({
        name: "number",
        description: "Picks a random number in a given range.",
    })
    public handleNumber(
        @Context() [interaction]: SlashCommandContext,
        @Options() { min, max }: NumberOptions
    ) {
        if (!min) min = 0;

        const picked = Math.floor(Math.random() * max) + min;
        return interaction.reply(`${picked}!`);
    }

    @Subcommand({
        name: "choice",
        description: "Picks an item from a given list.",
    })
    public handleChoice(
        @Context() [interaction]: SlashCommandContext,
        @Options() options: ChoiceOptions
    ) {
        const itemsString = options.items;
        if (itemsString.indexOf(",") == -1)
            return interaction.reply(`Please provide at least two items.`);

        const items = itemsString
            .split(",")
            .filter(item => item.length > 0)
            .map(item => item.trim());

        if (items.length < 2)
            return interaction.reply(`Please provide at least two items.`);

        const selectedItem = items[Math.floor(Math.random() * items.length)];
        return interaction.reply(`${selectedItem}!`);
    }
}
