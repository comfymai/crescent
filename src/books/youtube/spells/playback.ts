import { ReplyBuilder } from "@app/core/reply.builder";
import { Logger } from "@nestjs/common";
import { ChannelType } from "discord.js";
import { Context, Options, SlashCommandContext, Subcommand } from "necord";

import { YoutubeGroup } from ".";
import { SessionManager } from "../session.manager";
import { PlayIngredients } from "./ingredients/playback";

@YoutubeGroup()
export class PlaybackSpells {
    private readonly logger = new Logger(PlaybackSpells.name);
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
            return interaction.reply(
                ReplyBuilder.create()
                    .addWarning({
                        description:
                            "You cannot use this command outside of a guild.",
                    })
                    .setEphemeral()
                    .build()
            );

        const member = await guild.members
            .fetch(interaction.user)
            .catch(() => null);
        if (member == null) {
            this.logger.warn("Failed to find member.");
            return interaction.reply(
                ReplyBuilder.create()
                    .addError({
                        description: "Failed to find you, try again later.",
                    })
                    .setEphemeral()
                    .build()
            );
        }
        if (member.voice.channel == null) {
            interaction.reply(
                ReplyBuilder.create()
                    .addWarning({
                        description:
                            "You must be in a voice channel to use this command.",
                    })
                    .setEphemeral()
                    .build()
            );
            return null;
        }

        if (member.voice.channel.type != ChannelType.GuildVoice) {
            interaction.reply(
                ReplyBuilder.create()
                    .addWarning({
                        description: "You must be in a normal voice channel.",
                    })
                    .build()
            );
            return null;
        }

        const session = this.sessions.getOrCreate(member.voice.channel);

        const connection = session.connection;
        if (connection == null)
            return interaction.reply(
                ReplyBuilder.create()
                    .addWarning({
                        description:
                            "The connection is being estabilished, try again in a bit.",
                    })
                    .setEphemeral()
                    .build()
            );

        const trackStatus = session.addTrack(url);
        return interaction.reply(
            ReplyBuilder.create()
                .addEmbed({
                    description:
                        trackStatus === "playing"
                            ? `Now playing track from ${url}`
                            : `Track queued from ${url}.`,
                })
                .build()
        );
    }
}
