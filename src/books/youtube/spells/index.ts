import { getDevelopmentGuilds } from "@app/helpers/getDevelopmentGuilds";
import { Logger } from "@nestjs/common";
import { ChannelType } from "discord.js";
import {
    Context,
    createCommandGroupDecorator,
    SlashCommandContext,
    Subcommand,
} from "necord";
import { SessionManager } from "../session.manager";

export const YoutubeGroup = createCommandGroupDecorator({
    name: "youtube",
    description:
        "A group of commands to interact with YouTube videos in voice chats.",
    guilds: getDevelopmentGuilds(),
});

@YoutubeGroup()
export class YoutubeSpells {
    private readonly logger = new Logger(YoutubeSpells.name);
    constructor(private readonly sessions: SessionManager) {}

    @Subcommand({
        name: "join",
        description: "Makes the bot join your current voice channel.",
    })
    public async handleJoin(@Context() [interaction]: SlashCommandContext) {
        const member = await interaction.guild?.members.fetch(interaction.user);
        if (!member) {
            this.logger.warn("Failed to find member.");
            return interaction.reply("Failed to find you, try again later.");
        }

        if (member.voice.channel == null)
            return interaction.reply(
                "You must be in a voice channel to use this command."
            );

        if (member.voice.channel.type != ChannelType.GuildVoice)
            return interaction.reply(`You must be in a normal voice channel!`);

        const session = this.sessions.create(member.voice.channel);
        if (session) return interaction.reply("Joined your voice channel.");
        else
            return interaction.reply(
                "I'm already connected to a voice channel in this guild."
            );
    }

    @Subcommand({
        name: "leave",
        description: "Closes any existing voice connections in this guild.",
    })

    public async handleLeave(@Context() [interaction]: SlashCommandContext) {
        const guild = interaction.guild;
        if (guild == null)
            return interaction.reply({
                content: "This command can only be used in a guild",
                ephemeral: true,
            });

        const session = this.sessions.getById(guild.id);
        if (session == null)
            return interaction.reply({
                content: "There's no voice connections in this guild",
                ephemeral: true,
            });

        const disconnected = this.sessions.disconnect(session.id);
        if (disconnected)
            return interaction.reply({
                content: "Bye, bye!",
                ephemeral: true,
            });
        else
            return interaction.reply({
                content: "Something wrong happened while trying to disconnect.",
                ephemeral: true,
            });
    }
}
