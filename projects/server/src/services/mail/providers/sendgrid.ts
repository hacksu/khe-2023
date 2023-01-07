import { MailService, MailDataRequired } from '@sendgrid/mail';
import { MailProvider } from './_base';

type ComputedFields = 'from';
type SendInput = Omit<MailDataRequired, ComputedFields> & Partial<Pick<MailDataRequired, ComputedFields>>;

export class SendgridMailProvider extends MailProvider<{
    apiKey: string;
    defaults?: Partial<MailDataRequired>;
}> {
    private service: MailService;
    protected defaultPayload: Partial<MailDataRequired>;

    protected init() {
        console.log('did init')
        this.defaultPayload = this.config.defaults || {};
        this.service = new MailService();
        this.service.setApiKey(this.config.apiKey);
    }

    async send(input: SendInput) {
        // @ts-ignore
        const payload: MailDataRequired = {
            ...this.defaultPayload,
            ...input,
        }
        payload.trackingSettings = {
            subscriptionTracking: {
                enable: false,
            }
        }
        console.log(payload);
        return await this.service.send(payload);
    }
}


// new SendgridMailProvider({ from: 'hi', apiKey: '', })

