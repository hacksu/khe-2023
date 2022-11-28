This project is structured as a monorepo, which means that it contains multiple projects (independently executable codebases) in one repository. Reductively: The **server** project is responsible for storing data and responding to low-level requests to view or change it; the **staff** project consists of web pages that will allow staff to access and modify that the data that they need; and the **web** project consists of pieces of web pages that can be used to display information to or receive information from users of the public-facing Kent Hack Enough website.

<!-- subfolders -->

Dependencies are installed and managed by the program **npm**, which is also the name of [the website that distributes them](https://www.npmjs.com/). Each project within the monorepo is defined as an npm workspace, meaning that npm (the package manager) knows that each is a separate thing, and you can run commands in specific workspaces with the `-w projects/[project name]` flag. Turborepo, an application used to efficiently build monorepo code, also knows about workspaces, and you can pass their names to its `--filter` argument to get it to run commands for only specific workspaces. The repository readme gives some practical examples of this stuff too.

## Videos explaining many of the major dependencies:

1. [Node.js](https://www.youtube.com/watch?v=ENrzD9HAZK4)
2. [TypeScript in 100 Seconds](https://www.youtube.com/watch?v=zQnBQ4tB3ZA)
3. [TypeScript - Continued](https://www.youtube.com/watch?v=ahCwqrYpIuM&)
4. [React in 100 Seconds](https://www.youtube.com/watch?v=Tn6-PIqc4UM&ab_channel=Fireship)
5. [React Hooks](https://www.youtube.com/watch?v=TNhaISOUy6Q&ab_channel=Fireship)
6. [React & TypeScript](https://www.youtube.com/watch?v=ydkQlJhodio)
7. [React AntiPaterns](https://www.youtube.com/watch?v=b0IZo2Aho9Y&ab_channel=Fireship)
8. [Next.js](https://www.youtube.com/watch?v=Sklc_fQBmcs&)
9. [MongoDB](https://www.youtube.com/watch?v=-bt_y4Loofg)
10. [Monorepos](https://www.youtube.com/watch?v=9iU_IE6vnJ8)
