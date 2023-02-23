import { Context, createCommandGroupDecorator, Options, SlashCommandContext, Subcommand } from "necord";

import { getDevelopmentGuilds } from "@app/helpers/getDevelopmentGuilds";

import { HttpCatOptions } from "./options/httpcat";

const MiscGroup = createCommandGroupDecorator({
    name: "misc",
    description: "A group of isolated commands."
})

@MiscGroup()
export class MiscCommands {
    @Subcommand({
        name: "httpcat",
        description: "Shows an HTTP kitty!",
        guilds: getDevelopmentGuilds(),
    })
    public async handleHttpCat(
        @Context() [interaction]: SlashCommandContext,
        @Options() { code }: HttpCatOptions
    ) {
        const baseURL = "https://http.cat";

        return interaction.reply(`${baseURL}/${code}`);
    }
}
