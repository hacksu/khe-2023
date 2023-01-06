import sanitizeHtml from 'sanitize-html';
// import * as runtime from 'react/jsx-runtime'
// @ts-ignore
import { compile, run } from '@mdx-js/mdx';


/** @export 'compile' */

export class ReactMarkdownCompiler {
    public styleRules: [string, string][];
    constructor(public config: {
        components: Record<string, (...args: any) => JSX.Element | 'string'>,
        styles: string[],
        runtime: any,
    }) {
        this.styleRules = this.cssRules(this.config.styles);
    }

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

    cssRules(css: string | string[]): [string, string][] {
        if (typeof css === 'string')
            return this.cssRules([css]);
        // @ts-ignore
        const rules = [...Array.from(css.join(' ').matchAll(/(.+){([^}]+)}/g)).map(o => {
            return [
                o[1].trim(), o[2].split(/\r?\n/)
                    .join('').split(';')
                    .map(o => o.trim()).join(';'),
                Math.max(1, Array.from(o[1].trim().matchAll(/[:.>#\s]/g)).length),
            ];
        }).values()] as [string, string, number][];
        rules.sort((a: any, b: any) => a[2] >= b[2] ? 1 : -1);
        return rules.map(o => o.slice(0, 2)) as [string, string][];
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

