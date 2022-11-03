import { FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';

type RecursiveUppercase<T> = T extends object ? {
    [P in keyof T as Uppercase<P>]: RecursiveUppercase<T[P]>
} : T;

declare namespace config {

    interface BaseConfig {
        mode: 'development' | 'production' | 'test';
    }

    interface ProjectConfig {}
    type MasterConfig = ProjectConfig & BaseConfig;
    type Configuration = ProjectConfig & Partial<BaseConfig>;

    export type ProjectName = keyof ProjectConfig;
    export type ProjectConfigFieldPaths = FieldPath<ProjectConfig[ProjectName]>;
    export type ConfigFieldPath = FieldPath<MasterConfig> | ProjectConfigFieldPaths;

    // export function Config<N extends ProjectName, K extends FieldPath<ProjectConfig[N]>>(key: K): FieldPathValue<ProjectConfig[N], K>
    // export function Config<K extends FieldPath<MasterConfig>>(key: K): FieldPathValue<MasterConfig, K>

    // export const config: MasterConfig & (<T extends ProjectConfig & BaseConfig, K extends FieldPath<T>>(key: K) => FieldPathValue<T, K>)
    export const config: MasterConfig & ProjectConfig[ProjectName]
        // & (<K extends FieldPath<MasterConfig>>(key: K) => FieldPathValue<MasterConfig, K>) 
        // & (<N extends ProjectName, K extends FieldPath<ProjectConfig[N]>>(key: K) => FieldPathValue<ProjectConfig[N], K>)

    // export const Config: MasterConfig & ProjectConfig[ProjectName]
        // & (<K extends FieldPath<MasterConfig>>(key: K) => FieldPathValue<MasterConfig, K>) 
        // & (<N extends ProjectName, K extends FieldPath<ProjectConfig[N]>>(key: K) => FieldPathValue<ProjectConfig[N], K>)

    // export const CONFIG: RecursiveUppercase<MasterConfig> & RecursiveUppercase<ProjectConfig[ProjectName]>
        // & (<K extends FieldPath<RecursiveUppercase<MasterConfig>>>(key: K) => FieldPathValue<RecursiveUppercase<MasterConfig>, K>) 
        // & (<N extends ProjectName, K extends FieldPath<RecursiveUppercase<ProjectConfig[N]>>>(key: K) => FieldPathValue<RecursiveUppercase<ProjectConfig[N]>, K>)

    

}

export = config;