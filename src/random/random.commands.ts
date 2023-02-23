import { Injectable } from "@nestjs/common";
import {
    Context,
    createCommandGroupDecorator,
    NumberOption,
    Options,
    SlashCommandContext,
    StringOption,
    Subcommand,
} from "necord";
import { getDevelopmentGuilds } from "src/helpers/getDevelopmentGuilds";

const RandomGroup = createCommandGroupDecorator({
    name: "random",
    description: "A group of commands for randomness.",
    guilds: getDevelopmentGuilds(),
});

class NumberOptions {
    @NumberOption({
        name: "max",
        description: "The largest number that can be picked, exclusive.",
        required: true,
    })
    max: number;

    @NumberOption({
        name: "min",
        description:
            "The smallest number that can be picked, inclusive. Defaults to 0.",
    })
    min?: number;
}

class ChoiceOptions {
    @StringOption({
        name: "items",
        description: "A list of items, separated by commas.",
        required: true
    })
    items: string;
}

@Injectable()
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

        const items = itemsString.split(",").filter(item => item.length > 0)

        if (items.length < 2)
            return interaction.reply(`Please provide at least two items.`);

        const selectedItem = items[Math.floor(Math.random() * items.length)]
        return interaction.reply(`${selectedItem}!`)
    }
}
