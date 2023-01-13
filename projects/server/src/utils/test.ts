
let compile;
import('@mdx-js/mdx').then((mdx) => {
    compile = mdx.compile;
    // console.log('import mdx', mdx)
})

// console.log({ compile });

export function testModule() {
    return 'hi there';
}



type AsyncImported<T> = {
    [P in keyof T]: T[P] extends (...args: any) => infer R ? Promise<Awaited<R>> : Promise<Awaited<T[P]>>
}

function asyncImport<T>(cb: () => T, config: {
    // functions?: FieldPath<T>
}): AsyncImported<Awaited<T>> {
    const result = cb();
    const proxies = new Map<keyof T, any>();
    // proxy all request to promises
    return {} as any;
}



asyncImport(() => import('@mdx-js/mdx'), {})