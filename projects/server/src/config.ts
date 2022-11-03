import { applyConfig, config } from '@kenthackenough/config'

declare module '@kenthackenough/config' {
    export interface ProjectConfig { server: ServerConfig }

    export interface ServerConfig {
        heya: 'waaat'
    }

}

// applyConfig({

// })

// applyConfig('wat.json')

// applyConfig({

// })