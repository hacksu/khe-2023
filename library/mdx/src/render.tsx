import { load } from 'cheerio';
import sanitizeHtml from 'sanitize-html';
import * as runtime from 'react/jsx-runtime'
// @ts-ignore
import { compile, run } from '@mdx-js/mdx';
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

}
