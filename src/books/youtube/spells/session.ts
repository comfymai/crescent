import { ReplyBuilder } from "@app/core/reply.builder";
import { Logger } from "@nestjs/common";
import { ChannelType } from "discord.js";
import { Context, SlashCommandContext, Subcommand } from "necord";

import { YoutubeGroup } from ".";
import { SessionManager } from "../session.manager";

@YoutubeGroup()
export class SessionSpells {
    private readonly logger = new Logger(SessionSpells.name);
    constructor(private readonly sessions: SessionManager) {}

    @Subcommand({
        name: "join",
        description: "Makes the bot join your current voice channel.",
    })
    public async handleJoin(@Context() [interaction]: SlashCommandContext) {
        const member = await interaction.guild?.members.fetch(interaction.user);
        if (!member) {
            this.logger.warn("Failed to find member.");
            return interaction.reply(
                ReplyBuilder.create()
                    .addError({
                        title: "Error",
                        description: "Failed to find you, try again later",
                    })
                    .build()
            );
        }

        if (member.voice.channel == null)
            return interaction.reply(
                ReplyBuilder.create()
                    .addWarning({
                        title: "You are forgetting something...",
                        description:
                            "You must be in a voice channel to use this command.",
                    })
                    .build()
            );

        if (member.voice.channel.type != ChannelType.GuildVoice)
            return interaction.reply(
                ReplyBuilder.create()
                    .addWarning({
                        title: "Unsupported Channel",
                        description:
                            "You must be in a regular voice channel to use this command.",
                    })
                    .build()
            );

        const session = this.sessions.create(member.voice.channel);
        if (session)
            return interaction.reply(
                ReplyBuilder.create()
                    .addSuccess({
                        title: "Joined",
                        description:
                            "Created a connection in your voice channel.",
                    })
                    .build()
            );
        else
            return interaction.reply(
                ReplyBuilder.create()
                    .addWarning({
                        description:
                            "There's already a connection on this guild.",
                    })
                    .build()
            );
    }

    @Subcommand({
        name: "leave",
        description: "Closes any existing voice connections in this guild.",
    })
    public async handleLeave(@Context() [interaction]: SlashCommandContext) {
        const guild = interaction.guild;
        if (guild == null)
            return interaction.reply(
                ReplyBuilder.create()
                    .addWarning({
                        description:
                            "This command can only be used in a guild.",
                    })
                    .setEphemeral()
                    .build()
            );

        const session = this.sessions.getById(guild.id);
        if (session == null)
            return interaction.reply(
                ReplyBuilder.create()
                    .addWarning({
                        title: "There's no voice connections in this guild",
                        description: "Start by creating one.",
                    })
                    .setEphemeral()
                    .build()
            );

        const disconnected = this.sessions.disconnect(session.id);
        if (disconnected)
            return interaction.reply(
                ReplyBuilder.create()
                    .addEmbed({
                        title: "Left Channel",
                        description: "Bye, bye.",
                    })
                    .setEphemeral()
                    .build()
            );
        else
            return interaction.reply(
                ReplyBuilder.create()
                    .addError({
                        title: "Internal Error",
                        description:
                            "Something wrong happened while trying to disconnect.",
                    })
                    .setEphemeral()
                    .build()
            );
    }
}
