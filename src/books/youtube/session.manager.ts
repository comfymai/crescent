import { Nullable } from "@app/helpers/types";
import { joinVoiceChannel } from "@discordjs/voice";
import { Injectable, Logger } from "@nestjs/common";
import { VoiceChannel } from "discord.js";

@Injectable()
export class SessionManager {
    private readonly logger = new Logger(SessionManager.name)
    public readonly sessions: Session[];

    constructor() {
        this.sessions = [];
    }

    public create(channel: VoiceChannel): Nullable<Session> {
        if (this.getById(channel.guild.id)) {
            this.logger.warn(
                `Session creation failed because there's already a session with given ID "${channel.guild.id}".`
            );
            return null;
        }

        const session = Session.create({
            guildId: channel.guild.id,
        });

        this.sessions.push(session);
        this.logger.debug(
            `Created and added session to manager. (ID ${session.id})`
        );

        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        this.logger.debug(`Joined voice channel.`);

        return session;
    }

    public getById(id: string) {
        return this.sessions.find(session => session.id === id);
    }
}

interface SessionOptions {
    guildId: string;
}

export class Session {
    public static create(options: SessionOptions) {
        const { guildId } = options;
        return new Session(guildId);
    }

    private constructor(public readonly id: string) {}
}
