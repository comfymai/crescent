import { Nullable } from "@app/helpers/types";
import {
    AudioPlayer,
    AudioPlayerStatus,
    createAudioPlayer,
    getVoiceConnection,
    joinVoiceChannel,
    NoSubscriberBehavior,
    VoiceConnection,
} from "@discordjs/voice";
import { Injectable, Logger } from "@nestjs/common";
import { Collection, VoiceChannel } from "discord.js";

import { createResourceFrom } from "./helpers/createResourceFrom";

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
            channel,
        });

        this.sessions.set(session.id, session);
        this.logger.debug(
            `Created and added session to manager. (ID ${session.id})`
        );

        return session;
    }

    public getById(id: string): Nullable<Session> {
        return this.sessions.find(session => session.id === id) ?? null;
    }

    public getOrCreate(channel: VoiceChannel): Session {
        const existingSession = this.getById(channel.guild.id)
        return existingSession == null ? (() => {
            const session = Session.create({ channel }) 
            this.sessions.set(session.id, session)
            return session
        })() : existingSession;
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
                "Failed to diconnect session because its connection couldn't be acquired. This may happen if the bot hasn't finished connecting."
            );
            return false;
        }
    }
}

interface SessionOptions {
    channel: VoiceChannel;
}

interface Track {
    url: string;
}

export class Session {
    public static create(options: SessionOptions) {
        const { channel } = options;
        return new Session(channel);
    }

    private readonly logger: Logger;

    public readonly id: string;
    public readonly player: AudioPlayer;
    public readonly queuedTracks: Track[]
    public currentTrack: Nullable<Track>;

    private constructor(channel: VoiceChannel) {
        this.logger = new Logger(`Session/${channel.guild.id}`);

        this.id = channel.guild.id;
        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
        this.queuedTracks = [];
        this.currentTrack = null;

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        this.logger.debug(`Joined voice channel.`);

        connection.subscribe(this.player);

        this.player.on("stateChange", (before, after) => {
            if (
                before.status == AudioPlayerStatus.Playing &&
                after.status == AudioPlayerStatus.Idle
            ) {
                const next = this.nextTrack;

                if (next == null) {
                    this.logger.debug(`Done playing all tracks.`);
                    this.currentTrack = null;
                } else {
                    const resource = createResourceFrom(next.url);
                    this.player.play(resource);
                    this.currentTrack = {
                        url: next.url,
                    };
                    this.queuedTracks.shift()
                }
            }
        });
    }

    public addTrack(url: string): 'queued' | 'playing' {
        if (this.currentTrack == null) {
            this.currentTrack = {
                url,
            };
            const resource = createResourceFrom(url);
            this.player.play(resource);
            this.logger.debug(`Playing track: "${url}".`);
            return 'playing'
        } else {
            this.queuedTracks.push({
                url
            })
            this.logger.debug(`Queued track: "${url}".`);
            return 'queued'
        }
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

    public get nextTrack(): Nullable<Track> {
        return this.queuedTracks[0] ?? null;
    }
}
