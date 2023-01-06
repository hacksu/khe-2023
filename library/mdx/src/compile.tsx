import { load } from 'cheerio';
import sanitizeHtml from 'sanitize-html';
import * as runtime from 'react/jsx-runtime'
// @ts-ignore
import { compile, run } from '@mdx-js/mdx';


/** @export 'compile' */

export class ReactMarkdownCompiler {
    public styleRules: [string, string][];
    constructor(public config: {
        components: Record<string, (...args: any) => JSX.Element | 'string'>,
        styles: string[]
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
            const mdx = (await run(compiled, runtime)).default;
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

    /** Converts classes to inline styles */
    inlineStyles(html: string, rules: [string, string][]) {
        const $ = load(html);

        $('*').each(function () {
            const elem = $(this);
            const styles = elem.attr('style') || '';
            if (styles.trim().length > 0) {
                elem.attr('data-inline-style', styles);
            }
            const className = elem.attr('className') || '';
            if (className.length > 0) {
                elem.removeAttr('className');
                elem.attr('class', ((elem.attr('class') || '') + ' ' + className).trim());
            }
        })

        for (const [selector, rule] of rules) {
            const styles = cssToObject(rule);
            $(selector).each(function () {
                const elem = $(this);
                const previous = cssToObject(elem.attr('style') || '');
                for (const key in styles) {
                    previous[key] = styles[key];
                }
                elem.attr('style', Object.entries(previous).map(o => o.join(':')).join(';'));
            })
        }

        $('*').each(function () {
            const elem = $(this);
            elem.removeAttr('class');
            const styles = Object.assign(
                cssToObject(elem.attr('style') || ''),
                cssToObject(elem.attr('data-inline-style') || '')
            );
            if (Object.keys(styles).length > 0) {
                elem.attr('style', Object.entries(styles).map(o => o.join(':')).join(';'))
            }
        })

        return $.html();
    }
}


function cssToObject(styles: string) {
    return Object.fromEntries(styles.split(';').map(o => o.trim()).filter(o => o.length > 0).map(o => {
        const colon = o.indexOf(':');
        const [key, value] = [o.slice(0, colon).trim(), o.slice(colon + 1).trim()];
        return [key, value]
    }));
}
