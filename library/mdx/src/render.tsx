import { load } from 'cheerio';
import * as runtime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import { ReactMarkdownCompiler } from './compile';

/** @export 'render' */

export class ReactMarkdownRenderer extends ReactMarkdownCompiler {
    public styleRules: [string, string][];
    constructor(config: {
        styles?: string[]
    } & ReactMarkdownCompiler['config']) {
        super(config);
        this.styleRules = this.cssRules((this.config as any)?.styles || []);
        console.log(this.styleRules)
    }

    async render(markdown: string): Promise<string>
    async render(element: JSX.Element): Promise<string>
    async render(input: string | JSX.Element) {
        const result = await this.compile(input as any);
        const html = renderToStaticMarkup(result);
        const styled = this.inlineStyles(html, this.styleRules);
        return styled;
    }

    // /(.+){([^}]+)}/g
    // /(.+){([^}]+)}/g
    // /([^\r\n,{}]+)(,(?=[^}]*{)|\s*)(\{[\s\S][^}]*})/g

    cssRules(css: string | string[]): [string, string][] {
        if (typeof css === 'string')
            return this.cssRules([css]);
        // @ts-ignore
        // const rules = [...Array.from(css.join(' ').split('}').join('}\r\n').matchAll(/(.+){([^}]+)}/g)).map(o => {
        const rules = [...Array.from(css.join(' ').matchAll(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*)(\{[\s\S][^}]*})/g)).map(o => {
            return [
                o[1].trim(), o[3].trim().slice(1).slice(0, -1).trim().split(/\r?\n/)
                    .join('').split(';')
                    .map(o => o.trim()).join(';'),
                Math.max(1, Array.from(o[1].trim().matchAll(/[:.>#\s]/g)).length),
            ];
        }).values()] as [string, string, number][];
        rules.sort((a: any, b: any) => a[2] >= b[2] ? 1 : -1);
        return rules.map(o => o.slice(0, 2)) as [string, string][];
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

