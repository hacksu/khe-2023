import { sendMail } from '.';
import { WatEmailTemplate } from './components/wat';
import { Html, Button, render } from '@kenthackenough/mdx/email';
import React from 'react';


export async function sendTestEmail(to: string) {
    const content = render(<WatEmailTemplate name='Chris' />, {
        pretty: true,
    })
    return await sendMail('sendgrid', {
        to,
        subject: 'hi there! 6',
        // text: 'test 123!',
        html: content,
    })
}