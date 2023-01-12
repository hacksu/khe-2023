import type { EmotionCache, MantineThemeOverride } from '@mantine/core';
import type { EmotionServer } from '@emotion/server/create-instance';


export class MantineGlobals {
    static emotionCache: EmotionCache;
    static stylesServer: EmotionServer;
    static theme: MantineThemeOverride;
}

