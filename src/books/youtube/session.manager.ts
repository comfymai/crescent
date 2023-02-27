import { Nullable } from "@app/helpers/types";
import {
    getVoiceConnection,
    joinVoiceChannel,
    VoiceConnection,
} from "@discordjs/voice";
import { Injectable, Logger } from "@nestjs/common";
import { Collection, VoiceChannel } from "discord.js";

@Injectable()
export class SessionManager {
    private readonly logger = new Logger(SessionManager.name);
    public readonly sessions: Collection<string, Session>;

    constructor() {
        this.sessions = new Collection();
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

        this.sessions.set(session.id, session);
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

    public getById(id: string): Nullable<Session> {
        return this.sessions.find(session => session.id === id) ?? null;
    }

    public disconnect(id: string): boolean {
        const session = this.getById(id);
        if (session == null) return false;

        const disconnected = session.disconnect();
        if (disconnected) {
            this.sessions.delete(session.id);
            this.logger.debug(`Tossed connection/${session.id} into the void.`);
            return true;
        } else {
            this.logger.warn(
                "Failed to diconnect session because its connection couldn't be acquired. This should never happen."
            );
            return false;
        }
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

    private readonly logger: Logger;

    private constructor(public readonly id: string) {
        this.logger = new Logger(`Session/${id}`);
    }

    public disconnect(): boolean {
        const connection = this.connection;

        if (connection == null) {
            this.logger.warn(
                "Attempt to disconnect session failed, there's no connection."
            );
            return false;
        } else {
            connection.disconnect();
            connection.destroy();
            this.logger.debug("Disconnected and destroyed.");
            return true;
        }
    }

    public get connection(): Nullable<VoiceConnection> {
        return getVoiceConnection(this.id) ?? null;
    }
}
