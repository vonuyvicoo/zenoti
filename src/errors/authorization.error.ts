import { ZenotiError } from "./base";

export class AuthorizationError extends ZenotiError {
    public readonly name: string = "AuthorizationError";

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}


