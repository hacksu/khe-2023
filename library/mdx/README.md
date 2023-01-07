
## Markdown Renderer

Utilizes [mdx.js](https://mdxjs.com/)

### Render to HTML
```tsx
import { Button } from '@mantine/core';
import { ReactMarkdownRenderer } from '@kenthackenough/mdx/render';
import * as runtime from 'react/jsx-runtime';

const mdx = new ReactMarkdownRenderer({
    runtime, // JSX Runtime
    styles: [
        `.red { color: red }`,
        `.blue { color: blue }`,
    ],
    components: {
        Button,
    }
})

const output: string = await mdx.render(`

# Hi there!

<span class="blue">yeyeye!</span>

<Button class="red">click me!</Button>

`);

```

This outputs the following HTML into the `output` varaible above.
```html
<html>

<head></head>

<body>
    <h1>Hi there!</h1>
    <span style="color:blue">yeyeye!</span>
    <button type="button" data-button="true" style="color:red">
        <div><span>click me!</span></div>
    </button>
</body>

</html>
```



### Compile to a React Element
```tsx
import { Button } from '@mantine/core';
import { ReactMarkdownCompiler } from '@kenthackenough/mdx/compile';
import * as runtime from 'react/jsx-runtime';

const mdx = new ReactMarkdownCompiler({
    runtime, // JSX Runtime
    components: {
        Button,
    }
})

const output: JSX.Element = await mdx.compile(`

# Hi there!

<Button>click me!</Button>

`);

function SomeComponent() {
    return <div>
        {output}
    </div>
}

```


### Note

`ReactMarkdownRenderer` inherits from `ReactMarkdownCompiler`, including additional helper functions to apply styles and properly serialize the react component into static markup.

Although `ReactMarkdownRenderer` can do everything `ReactMarkdownCompiler` can, it relies on additional libraries. It is not recommended to use the `Renderer` if you have access to React rendering elsewhere in the application. 
- For example, the `Compiler` should be used in Next.js because you can have Next.js render the component for you, so you need not import the necessary libraries to render React.