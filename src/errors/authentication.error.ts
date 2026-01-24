import { ZenotiError } from "./base";

export class AuthenticationError extends ZenotiError {
    public readonly name: string = "AuthenticationError";

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

