// <reference path="./types.d.ts" />

import { merge } from 'lodash';
import types from './types';
export default types;

// export type Configuration = types.Configuration;

const projectConfig = {}

export const config = projectConfig;

export function applyConfig<T>(data: T) {
    merge(projectConfig, data)
}
