# demo-playwright-vue

This is a demo project made with Vue and Express, for testing Playwright and Tilt.

## Slides

The slides are available at https://github.com/c-harding/demo-playwright-vue/wiki

## Demo structure

This is the main branch, containing a working solution.

The following demos are used in the talk:

### Demo 1: Installing Playwright

Check out `demo-1`, then we’ll use the following commands:

```bash
mkdir e2e
cd e2e

yarn init
demo-playwright-vue-e2e

yarn create playwright
```

The result is in branch `result-1`.

### Demo 2: Testing

Check out `demo-2`.

Start both servers (`yarn dev` in both `/client` and `/server`).

Look at the app in the browser.

Then start the codegen

```bash
yarn exec playwright codegen localhost:3001
```

Capture the code for logging in/out. Add it to a test file.

Run the tests:

```bash
yarn exec playwright test --ui
```

Ideal result: branch `result-2`.

### Demo 3: Using a page object

Check out `demo-3`.

Write some more tests.

Ideal result: branch `result-3`.

### Demo 4a: Initial Tilt

Check out `demo-4a`.

Install `tilt`, run `tilt up`.

Result: `result-4a`.

### Demo 4b: Add Tilt for frontend

Check out `demo-4b`

Add Tilt configs for frontend and e2e tests.

Result: `result-4b`

Add Tilt buttons for e2e UI and codegen.

Result: `result-4c`.

## Commands

### Setup

`yarn` to install dependencies

`yarn client:dev` to start the frontend

`yarn server:dev` to start the backend

`yarn dev` to start both the frontend and the backend

### Tests

(Once Playwright has been set up, e.g. on main branch)

`yarn test:e2e:install` to install the browsers necessary for the tests

`yarn test:e2e` to run the tests

`yarn test:e2e:ui` to run the tests with a UI

`yarn test:e2e:codegen` to generate code for tests

### Tilt

(Once Tilt has been set up, e.g. on main branch)

Install Tilt: https://docs.tilt.dev/install.html

`tilt up` to start the UI

`tilt down` to stop any containers. Not relevant for this repo

`tilt ci` to run the tests and stop the processes after
