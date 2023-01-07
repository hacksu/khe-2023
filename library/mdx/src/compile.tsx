import sanitizeHtml from 'sanitize-html';
// import * as runtime from 'react/jsx-runtime'
// @ts-ignore
import { compile, run } from '@mdx-js/mdx';


export class ReactMarkdownCompiler {
    constructor(public config: {
        components: Record<string, (...args: any) => JSX.Element | 'string'>,
        runtime: any,
    }) {}

    async compile(markdown: string): Promise<JSX.Element>
    async compile(element: JSX.Element): Promise<JSX.Element>
    async compile(input: string | JSX.Element) {
        if (typeof input === 'string') {
            const sanitized = this.sanitize(input);
            const compiled = await compile(sanitized, {
                jsxImportSource: 'react',
                outputFormat: 'function-body',
            });
            const mdx = (await run(compiled, this.config.runtime)).default;
            return await this.compile(mdx({
                components: this.config.components,
            }))
        }
        return input;
    }

    /** Sanitizes the HTML */
    sanitize(html: string) {
        html = html.replaceAll(/(?!<.+)className(?==['"].+['"])/g, 'class');
        const sanitized = sanitizeHtml(html, {
            allowedTags: [
                ...sanitizeHtml.defaults.allowedTags,
                ...Object.keys(this.config.components),
            ],
            allowedAttributes: {
                '*': ['class'],
                ...sanitizeHtml.defaults.allowedAttributes,
                // ...Object.fromEntries(Object.entries(sanitizeHtml.defaults.allowedAttributes).map(o => [o[0], [...o[1], 'className']])),
                ...Object.fromEntries(Object.keys(this.config.components).map(k => ([k, ['*']]))),
            },
            parser: {
                lowerCaseTags: false,

            },
        });
        return sanitized.replaceAll(/(?!<.+)class(?==['"].+['"])/g, 'className');
    }

}

