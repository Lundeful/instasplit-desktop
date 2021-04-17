# Instasplit

![](https://github.com/lundeful/instasplitter/actions/workflows/build.yml/badge.svg)

Instasplit is a multi-platform desktop app for splitting an image into multiple images for use on Instagram. When posted to Instagram you can swipe as if it was one long seamless image. I created it as a tool to save myself from doing it manually and as a chance to learn Electron. It's more or less just a prototype so no tests or pretty code. At least it's working ¯\\\_(ツ)_/¯.

The app is made using Electron and React, written in TypeScript. It's confirmed working on Windows and Mac and there is a build script if you want to run it on Linux.

### How to install

I'm working on getting automated release builds up on Github. For now you can build it yourself. Clone the repo, run `yarn` to install dependencies and then you can create installers for your OS. On Windows run `yarn dist:win`, for Mac run `yarn dist:mac` and `yarn dist:linux` for Linux (untested). That will create a dist-folder containing the app to install.

### Running locally

Run scripts in the project directory. Run `yarn` to install dependencies. I recommend using `yarn`. If you want to use `npm` you must swap out `yarn` for `npm run` in the scripts.

### `yarn start`

Starts both electron and react in development mode. React is hosted on `http://localhost:3000`.

### `yarn start-react`

Starts react in development mode

### `yarn start-electron`

Starts electron in development mode

### `yarn build`

Compiles and builds both electron and react into `build` folder.

### `yarn dist:{mac | win | linux}`

Creates distribution for chosen OS in the `dist` folder.

### Tests?

Eeeh. It's a prototype and I just needed it up and running fast so I don't have to do split images in Photoshop or some other app every time. Unless suddenly a lot people started using the app it's not gonna happen.
