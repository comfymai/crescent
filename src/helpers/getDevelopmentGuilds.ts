export function getDevelopmentGuilds(): string[] {
    return process.env.DEVELOPMENT_GUILD ? [process.env.DEVELOPMENT_GUILD] : []
}
