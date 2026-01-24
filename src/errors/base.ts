export class ZenotiError extends Error {
    public readonly name: string = "ZenotiError";

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, ZenotiError.prototype);
    }
}
