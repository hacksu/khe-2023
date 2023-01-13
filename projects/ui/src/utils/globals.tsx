import type { EmotionCache, MantineThemeOverride } from '@mantine/core';
import type { EmotionServer } from '@emotion/server/create-instance';

/** @export 'globals' */
export class MantineGlobals {
    static emotionCache: EmotionCache;
    static stylesServer: EmotionServer;
    static theme: MantineThemeOverride;
}

