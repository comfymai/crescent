import { Context, Options, SlashCommandContext, Subcommand } from "necord";

import { YoutubeGroup } from ".";
import { SessionManager } from "../session.manager";
import { PlayIngredients } from "./ingredients/playback";

@YoutubeGroup()
export class PlaybackSpells {
    constructor(private sessions: SessionManager) {}

    @Subcommand({
        name: "play",
        description: "Plays the audio from a YouTube video."
    })
    public async playTrack(
        @Context() [interaction]: SlashCommandContext,
        @Options() { url }: PlayIngredients
    ) {
        const guild = interaction.guild;
        if (guild == null)
            return interaction.reply({
                content: "You cannot use this command outside of a guild.",
                ephemeral: true,
            });

        const session = this.sessions.getById(guild.id);
        if (session == null)
            // TODO: automatically call join here.
            return interaction.reply({
                content: "There's no voice connections in this guild.",
                ephemeral: true,
            });

        const connection = session.connection;
        if (connection == null)
            return interaction.reply({
                content:
                    "The connection is being estabilished, try again in a bit.",
                ephemeral: true,
            });

        const trackStatus = session.addTrack(url)
        if (trackStatus == 'playing') return interaction.reply(`Now playing track from: ${url}.`);
        else return interaction.reply(`Track queued: ${url}.`)
    }
}
