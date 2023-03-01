import { Nullable } from "@app/helpers/types";
import { Logger } from "@nestjs/common";
import { ChannelType } from "discord.js";
import { Context, Options, SlashCommandContext, Subcommand } from "necord";

import { YoutubeGroup } from ".";
import { Session, SessionManager } from "../session.manager";
import { PlayIngredients } from "./ingredients/playback";

@YoutubeGroup()
export class PlaybackSpells {
    private readonly logger = new Logger(PlaybackSpells.name)
    constructor(private sessions: SessionManager) {}

    @Subcommand({
        name: "play",
        description: "Plays the audio from a YouTube video.",
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

        const session = <Nullable<Session>> await (async () => {
            const existingSession = this.sessions.getById(guild.id)
            if (existingSession) return existingSession

            const member = await guild.members.fetch(interaction.user);
            if (!member) {
                this.logger.warn("Failed to find member.");
                interaction.reply(
                    "Failed to find you, try again later."
                );
                return null
            }

            if (member.voice.channel == null) {
                interaction.reply(
                    "You must be in a voice channel to use this command."
                );
                return null
            }

            if (member.voice.channel.type != ChannelType.GuildVoice) {
                interaction.reply(
                    `You must be in a normal voice channel!`
                );
                return null
            }

            const session = this.sessions.create(member.voice.channel);
            return session
        })()

        if (session == null) return;

        const connection = session.connection;
        if (connection == null)
            return interaction.reply({
                content:
                    "The connection is being estabilished, try again in a bit.",
                ephemeral: true,
            });

        const trackStatus = session.addTrack(url);
        if (trackStatus == "playing")
            return interaction.reply(`Now playing track from: ${url}.`);
        else return interaction.reply(`Track queued: ${url}.`);
    }
}
