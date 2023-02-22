import { Injectable } from "@nestjs/common";
import {
    Context,
    NumberOption,
    Options,
    SlashCommand,
    SlashCommandContext,
} from "necord";
import { getDevelopmentGuilds } from "src/helpers/getDevelopmentGuilds";

class HttpCatOptions {
    @NumberOption({
        name: "code",
        description: "An HTTP code.",
    })
    code: number;
}

@Injectable()
export class MiscCommands {
    @SlashCommand({
        name: "httpcat",
        description: "Shows an HTTP kitty!",
        guilds: getDevelopmentGuilds(),
    })
    public async handleHttpCat(
        @Context() [interaction]: SlashCommandContext,
        @Options() { code }: HttpCatOptions
    ) {
        const baseURL = "https://http.cat";

        return interaction.reply(`${baseURL}/${code}`)
    }
}
