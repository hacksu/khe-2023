import { config, Config, ProjectName, ProjectConfigFieldPaths, CONFIG } from '@kenthackenough/config'

declare module '@kenthackenough/config' {
    export interface ProjectConfig { staff: StaffConfig }

    export interface StaffConfig {
        /** yeeee */
        woah: 'hmmm'
    }

}

// config('staff.woah')
// config.staff.woah

// Config('staff.woah')
// Config('woah')
// Config('woah')

// config.woah;