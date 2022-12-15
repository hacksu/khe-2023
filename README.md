[![CI/CD](https://github.com/hacksu/khe-2023/actions/workflows/pipeline.yml/badge.svg)](https://github.com/hacksu/khe-2023/actions/workflows/pipeline.yml)

# Kent Hack Enough


This is a monorepo that contains all the necessary components to run our annual event.

It consists of 3 main facets:

### Server

The Server is where all backend and server logic is defined.

This consists of defining data structures, interfacing with the database, sending emails, etc.

As part of this environment, the API has built-in reverse proxying to the other components. This is disabled when deployed to the server, as the high-performance [NGINX reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) is used.

### Staff Management Portal

The Staff Management Portal is the main interface for admins and organizers to interface with the API.

This should implement all functionality needed by event organizers.
- Check-in
- Approving applicants
- Responding to Tickets
- ...etc

Because of this being a monorepo, the API calls are tighly coupled to the Server API code; allowing full TypeScript intellisense and validation.

### The UI *(library)*

Because of the need for us to have a different website each year due to our theming practices; the App project within this monorepo is intended to act as a baseline for all our websites. It shall implement all logical functionality and provide useful component exports that can be consumed by other projects.

With this, one will be able to import `@kenthackenough/ui` as a dependency in any other NextJS project and it will be able to use these components.

For example, the Registration Form is usually very complicated and requires numerous validation steps to ensure a proper user experience. Because of this, this is offloaded here in the monorepo where one can have excellent TypeScript intellisense and validation as part of having the API in the same project. Thus, one would define the Registration Form here (but void of any major styling), allowing the form to be imported into the annual website as a simple `<RegistrationForm />` component.

This design style ensures that any logical code is located within this repository, and thus removes the potentiality of messing up the entire website simply by changing the yearly styles.


## Installation

### Install NodeJS LTS
https://nodejs.org/en/download/

### Clone the Repository

```bash
git clone https://github.com/hacksu/khe-2023.git
```

### Install Dependencies
```bash
npm install
```

## Usage

### Run in Development Mode
```bash
npm run dev
```

This exposes the following endpoints:

#### API
- http://localhost:5000/api

#### Staff Management Portal
- http://staff.localhost:5000
- http://localhost:5001 *(do not use)*

#### Frontend
- http://localhost:5000
- http://localhost:5002 *(do not use)*

### Building for Production

Development mode provides hot reloading and various other benefits; but these slow down the performance of the entire project.

If you want to test the project's real-world performance, you must build it and run it in its production state.

```bash
# Build for production; minify and condense files.
npm run build
```

### Starting a Production Build

When you have built the project, you may run it with the `start` command.

```bash
# Run the latest build of all projects
npm run start
```


### Running Projects Individually

You can use turborepo's [filter](https://turborepo.org/docs/core-concepts/filtering) argument to only run a specific project.

```bash
# Only run the API in dev mode
npm run dev --filter=@kenthackenough/api
```

```bash
# Build the API and the Frontend APP
npm run build --filter=@kenthackenough/api --filter=@kenthackenough/app
```


```bash
# Start the API
npm run start --filter=@kenthackenough/api
```

## Deployment

*Note: If you are conducting a fresh deployment, see the [server setup instruction](./docs/SERVER.md).*

[ IMPLEMENT AND DOCUMENT AUTOMATED DEPLOYMENT ]





