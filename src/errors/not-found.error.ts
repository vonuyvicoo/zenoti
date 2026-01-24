import { ZenotiError } from "./base";

export class NotFoundError extends ZenotiError {
    public readonly name: string = "NotFoundError";

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
