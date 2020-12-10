# Preact example

This is a fully working example of Next.js 9.5 running on [Preact](https://github.com/preactjs/preact) instead of React.

This reduces the base JavaScript weight of pages to ~22kB.

> 🔭 In the future, this can be even smaller with some additional Webpack optimizations.

## How to use

Clone this repo and run `npm install`:

```sh
git clone https://github.com/developit/nextjs-preact-demo.git
cd nextjs-preact-demo
npm install
```

There are three commands available:

```sh
# start a development server:
npm run dev

# create a production build:
npm run build

# start a production server:
npm start
```

## How does it work?

The example takes advantage of npm/yarn aliases, which essentially allow installing `preact/compat` at `node_modules/react`.

Here's how this example repo was set up:

- Set up a basic Next.js app using `create-next-app`
- Install `preact`, uninstall `react` and `react-dom`.
- Install [preact-compat/react](https://github.com/preact-compat/react) and [preact-compat/react-dom](https://github.com/preact-compat/react-dom) for aliasing.
- Use an [npm alias](https://github.com/npm/rfcs/blob/latest/implemented/0001-package-aliases.md#detailed-explanation) to replace `react-ssr-prepass` with `preact-ssr-prepass` (also [works](https://twitter.com/sebmck/status/873958247304232961) with Yarn).


# Snapdragon

### Basic setup

- npm i --save react@npm:@preact/compat react-dom@npm:@preact/compat
- npm install --save-dev typescript @types/react @types/node (tsconfig.json added on build)

### next.js conventions

- _app for, among other things, global syles.
- SASS e.g. .module.scss for styles at component level (see next.config.js for including SASS: https://nextjs.org/docs/basic-features/built-in-css-support)

### Build: 

    1. Run once for project: git init (and/or create new repo for me: https://github.com/new)
    2. danminimac$ npm run build --profile, or --debug
    3. git add .
    4. danminimac$ git commit -m "{my message}"
    5. change origin: git remote set-url origin NEW_URL e.g. git remote set-url origin https://github.com/danhartley/netlify-preact-test.git
    6. (once, or 4 above: git remote add origin https://github.com/danhartley/netlify-preact-test.git)
    7. git push

### To publish

- Create netlify.toml
- Add, push to git, etc.
- Site: relaxed-shockley-d78002
- NB replaced "dev": "cross-env NODE_ENV=development next", with "dev": "next dev",
- NB replaced "start": "cross-env NODE_ENV=production next start", "start": "next start",

### Typescript 

- For .ts or .tsx files: npm install --save-dev typescript @types/react @types/node (tsconfig.json created automatically)

### Change origin

1. $ git remote rm origin
2. $ git remote add origin git@github.com:aplikacjainfo/proj1.git
3. $ git config master.remote origin
4. $ git config master.merge refs/heads/master
5. $ git push --set-upstream origin master

### Support for Netlify CMS 

- https://www.netlifycms.org/docs/add-to-your-site/
- Add /admin under /public
- For identity, follow the steps: https://www.netlifycms.org/docs/add-to-your-site/ or https://www.netlifycms.org/docs/nextjs/
- Add the <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script> script


### Netlify CLI

- npm i netlify-cli (instead of "New site from Git" in the dashboard, we can run: netflify deploy)

## To do

- Create deploy branch (rather than using Master) or gh-pages (with dist/build files only)?

## Absolute paths

- Add "baseUrl": "." to compilerOptions in tsconfig.json
- https://nextjs.org/docs/advanced-features/module-path-aliases

## Naming

- Why providers/index.tsx and not providers/providers.tsx? The URL of the first is /providers and of the second /providers/providers

## Testing

- For simple paths, add moduleDirectories: ['node_modules', './'] in jest.config.js

# JS

- Already included: https://preactjs.com/guide/v10/preact-testing-library/

# TS

Not sure which, if any, of these libraries were needed:

- npm i jest ts-jest babel-jest -D
- npm i -D @babel/preset-react
- npm i -D @babel/preset-env
- //babel.config.js --> module.exports = {presets: ['@babel/preset-env']}

Required:

- use relative path e.g. ./
- jest.config.js 

## Debugging

- Read https://mattmazzola.medium.com/how-to-debug-jest-tests-with-vscode-48f003c7cb41
- create new launch.json from the snippet
- Create new JS debug terminal
- run npm test from there