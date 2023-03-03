import { getDevelopmentGuilds } from "@app/helpers/getDevelopmentGuilds";
import { createCommandGroupDecorator } from "necord";

export const YoutubeGroup = createCommandGroupDecorator({
    name: "youtube",
    description:
        "A group of commands to interact with YouTube videos in voice chats.",
    guilds: getDevelopmentGuilds(),
});

