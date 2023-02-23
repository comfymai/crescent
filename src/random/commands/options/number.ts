import { NumberOption } from "necord";

export class NumberOptions {
    @NumberOption({
        name: "max",
        description: "The largest number that can be picked, exclusive.",
        required: true,
    })
    max: number;

    @NumberOption({
        name: "min",
        description:
            "The smallest number that can be picked, inclusive. Defaults to 0.",
    })
    min?: number;
}
