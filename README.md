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


# Me

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

### Typescript 

- For .ts or .tsx files: npm install --save-dev typescript @types/react @types/node (tsconfig.json created automatically)

### Change origin

1. $ git remote rm origin
2. $ git remote add origin git@github.com:aplikacjainfo/proj1.git
3. $ git config master.remote origin
4. $ git config master.merge refs/heads/master
5. $ git push --set-upstream origin master

### Support for netlify CMS 

- https://www.netlifycms.org/docs/add-to-your-site/
- Add /admin under /public