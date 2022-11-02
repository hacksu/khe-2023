import { Config } from '@kenthackenough/config'

declare module '@kenthackenough/config' {
    export interface ProjectConfig { server: ServerConfig }

    export interface ServerConfig {
        heya: 'waaat'
    }

}

