import { WebDocument } from '@kenthackenough/ui/document';

import { createEmotionCache } from '@mantine/core';
import { createStylesServer } from '@mantine/next';
export const emotionCache = createEmotionCache({
    key: 'mantine-ssr',
});

WebDocument.emotionCache = emotionCache;
WebDocument.stylesServer = createStylesServer(emotionCache);

export default WebDocument;
