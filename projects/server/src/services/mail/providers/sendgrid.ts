import { MailService, MailDataRequired } from '@sendgrid/mail';
import { Client } from '@sendgrid/client';
import { MailProvider } from './_base';
import { Mail } from '../../../models/emails/model';

type ComputedFields = 'from';
type SendInput = Omit<MailDataRequired, ComputedFields> & Partial<Pick<MailDataRequired, ComputedFields>>;

const DEBUG = false;

export class SendgridMailProvider extends MailProvider<{
    apiKey: string;
    defaults?: Partial<MailDataRequired>;
}> {
    protected client: Client;
    protected service: MailService;
    protected defaultPayload: Partial<MailDataRequired>;

    protected init() {
        this.defaultPayload = this.config.defaults || {};
        this.service = new MailService();
        this.service.setApiKey(this.config.apiKey);
        this.client = new Client();
        this.client.setApiKey(this.config.apiKey);
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
        const doc = new Mail({
            from: payload.from.toString(),
            to: payload.to?.toString(),
            subject: payload.subject,
            provider: {
                name: 'sendgrid',
            }
        })
        if (DEBUG) console.log(payload);
        const req = (await this.service.send(payload))[0];
        if (req.statusCode === 202) {
            doc.set('provider.sendgridMessageId', req.headers['x-message-id']);
            await doc.save();
        } else {
            console.error(req);
            throw new Error(`Failed to send message`);
        }
        return doc;
    }

    /** Manages SendGrid Unsubscribes
     * - `add` an email; unsubscribes them from all our emails
     * - `remove` an email; deletes their email from the unsubscribe list
     * - `get` to check if an email has unsubscribed
     * - `list` to list all emails that have unsubscribed
     */
    async unsubscribe(action: 'list'): Promise<({ created: number, email: string })[]>
    async unsubscribe(action: 'add' | 'remove' | 'get', email: string): Promise<boolean>
    async unsubscribe(action: 'list' | 'add' | 'remove' | 'get', email?: string) {
        if (action === 'add') {
            const req = (await this.client.request({
                url: `/v3/asm/suppressions/global`,
                method: 'POST',
                body: {
                    recipient_emails: [email]
                }
            }))[0];
            if (DEBUG) console.log('unsubscribe.add', req);
            return req.statusCode === 201;
        } else if (action === 'remove') {
            const req = (await this.client.request({
                url: `/v3/asm/suppressions/global/${email}`,
                method: 'DELETE',
            }))[0];
            if (DEBUG) console.log('unsubscribe.remove', req);
            return req.statusCode === 204;
        } else if (action === 'list') {
            const req = (await this.client.request({
                url: `/v3/suppression/unsubscribes`,
                method: 'GET',
            }))[0];
            if (DEBUG) console.log('unsubscribe.list', req);
            return req.body;
        } else if (action === 'get') {
            const req = (await this.client.request({
                url: `/v3/asm/suppressions/global/${email}`,
                method: 'GET',
            }))[0];
            if (DEBUG) console.log('unsubscribe.get', req);
            return (req.body as any)?.recipient_email === email;
        }
    }
}


// new SendgridMailProvider({ from: 'hi', apiKey: '', })

