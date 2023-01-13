// @ts-ignore
import { Logger } from 'tslog';

const base = new Logger();

//  displayDateTime: false, displayFunctionName: false, 
export const logger = new Logger({
    prettyLogTemplate: "{{logLevelName}} {{filePathWithLine}}{{name}}\t",
    prettyLogStyles: {
        ...base.settings.prettyLogStyles,
        filePathWithLine: 'dim',
    }
});
export const log = logger;

import('./test.js').then(o => {
    console.log('imported test', o)
})