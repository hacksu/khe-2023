import { load } from 'cheerio';
import * as runtime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import { ReactMarkdownCompiler } from './compile';

/** @export 'render' */

export class ReactMarkdownRenderer extends ReactMarkdownCompiler {

    async render(markdown: string): Promise<string>
    async render(element: JSX.Element): Promise<string>
    async render(input: string | JSX.Element) {
        const result = await this.compile(input as any);
        const html = renderToStaticMarkup(result);
        const styled = this.inlineStyles(html, this.styleRules);
        return styled;
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

