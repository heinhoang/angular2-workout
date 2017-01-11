# Personal Trainer

Workout App using Angular2 and TypeScript

## Requirements

- shim: This provides ES2015 features for older browsers
- reflect-metadata: This adds decorator support
- zone.js: This manages change detection
- typescript.js: This is the current version of TypeScript
- system.js: This loads our modules
- RxJS: Reactive Extensions for JavaScript

## Install

Clone this repo and execute in your favourite shell:

* `npm i -g gulp` to install gulp globally (if you don't have it installed already)
* `npm install` to install local npm dependencies

> While `npm intall` should also install the typings, at times this does not happen. Install typing with command `npm typings install`
## Play

After completing installation type in your favourite shell:

* `gulp play` to start the app in a new browser window. App files are observed and will be re-transpiled on each change.

> If you see a bunch of **TypeScript** compilation errors while running `gulp play`, the required **typings** did not get installed.  While `npm install` should also install the typings, at times this does not happen. 
> To fix this, try to install typings again with command `npm run typings install`. 
> If the typing installation throws error try to upgrade the typing global installation with command `npm install typings -g` and then run the command `npm run typings install` again.


## Work Flow

1. `gulp play` will run `play` task in `gulpfile.js`
2. `play` task will run server by `connect.server` function, open server uri in browser by `open` and run `ts2js` task
3. `ts2js` task will transpile ts files in 'src' folder to js [ES5] in dist folder
4. once server uri opened, it looks for index.html in which it runs `System.import('app')`
5. SystemJS will load 'bootstrap.js' to browser based on 'systemjs.config.js'
bootstrap.js -> ./components/app/app.module.ts -> ./components/app/app.component.ts -> header.component.ts and app.routes.ts