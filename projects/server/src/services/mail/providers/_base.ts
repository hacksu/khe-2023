

type MailProviderConfig = {
    // from: string;
}

export class MailProvider<C extends object = {}> {
    constructor(protected config: C & MailProviderConfig) {
        this.init();
    }

    protected init() {}

    send(input: any) {
        throw new Error(`Not Implemented`);
    }
}

