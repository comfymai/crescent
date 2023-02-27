import { Spark } from "@core/spark";
import { joinVoiceChannel } from "@discordjs/voice";
import {
    Context,
    createCommandGroupDecorator,
    SlashCommandContext,
    Subcommand,
} from "necord";

const YoutubeGroup = createCommandGroupDecorator({
    name: "youtube",
    description:
        "A group of commands to interact with YouTube videos in voice chats.",
});

@YoutubeGroup()
export class YoutubeSpells extends Spark {
    constructor() {
        super();
    }

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

        const isMemberInVC = member.voice.channel != null;
        if (!isMemberInVC)
            return interaction.reply(
                `You must be in a voice channel to use this command.`
            );

        const vc = member.voice.channel;
        joinVoiceChannel({
            channelId: vc.id,
            guildId: vc.guildId,
            adapterCreator: vc.guild.voiceAdapterCreator,
        });

        return interaction.reply("Joined!");
    }
}
