import { NumberOption } from "necord";

export class HttpCatOptions {
    @NumberOption({
        name: "code",
        description: "An HTTP code.",
    })
    code: number;
}
