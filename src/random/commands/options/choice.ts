import { StringOption } from "necord";

export class ChoiceOptions {
    @StringOption({
        name: "items",
        description: "A list of items, separated by commas.",
        required: true
    })
    items: string;
}
