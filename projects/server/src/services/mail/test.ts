import { sendMail } from '.';
import { ReactMarkdownRenderer } from '@kenthackenough/mdx/server/render';
import * as runtime from 'react/jsx-runtime';

// const ReactMarkdownRenderer = import('@kenthackenough/mdx/render').then(o => o.ReactMarkdownRenderer);
// const uuh = require('@kenthackenough/mdx/server/render');

const mdx = new ReactMarkdownRenderer({
    runtime, // JSX Runtime
    styles: [
        `.red { color: red } .blue { color: blue }`,
        // `.blue { color: blue }`,
        `body { border: 1px solid black; }`
    ],
    components: {

    }
})

console.log(ReactMarkdownRenderer);


export async function sendTestEmail(to: string) {
    const content = await mdx.render(`

    # Hi there!

    <span class="blue">yeyeye!</span>

    <Button class="red">click me!</Button>

        `)
    return await sendMail('sendgrid', {
        to,
        subject: 'hi there! 4',
        // text: 'test 123!',
        html: content,
    })
}