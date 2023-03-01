import { StringOption } from "necord";

export class PlayIngredients {
    @StringOption({
        name: 'url',
        description: "A YouTube video URL to be played.",
        required: true
    })
    url: string
}

