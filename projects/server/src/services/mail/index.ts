import { MailProvider } from './providers/_base';
import { SendgridMailProvider } from './providers/sendgrid';


type Provider = keyof MailProviders;
type MailProviders = typeof providers;
const providers = {
    sendgrid: new SendgridMailProvider({
        apiKey: process.env.SENDGRID_API_KEY!,
        defaults: {
            from: 'test@khe.io'
        }
    }),
    woah: new MailProvider({}),
}

export async function sendMail<P extends Provider>(provider: P, ...args: Parameters<MailProviders[P]['send']>) {
    // @ts-ignore
    const result =  await providers[provider].send(...args);
    console.log('sendMail', result);
}

