## This project is no longer maintained
I have created a newer and better web version at [instasplit.app](https://instasplit.app).

# Instasplit for desktop (Deprecated)

![](https://github.com/lundeful/instasplitter/actions/workflows/build.yml/badge.svg)

Instasplit is a multi-platform desktop app for splitting an image into multiple images for use on Instagram. When posted to Instagram you can swipe as if it was one long seamless image. I created it as a tool to save myself and others from doing it manually and as a chance to learn Electron. It's more or less just a quick prototype/POC so no tests or pretty code. At least it's working ¯\\\_(ツ)_/¯.

The app is made using Electron and React, written in TypeScript. 

### How to install

Check the **release** section on this repo to download the newest release. There are builds for Windows (.exe) and MacOS (.dmg) available. Just download and run.

### How to use

* Open the app
* Select your image
* Scroll to zoom, click and drag to change crop placement
* Choose amount of images to split into
* Choose your image ratio
  * Default ratio is 4 by 5 (width:height). It is the ratio that allows for the largest images on Instagram
  * On Instagram all images in a single post must be same ratio
* Save image to disk

### Screenshots

![Select File](https://user-images.githubusercontent.com/31478985/120250545-d16a3b00-c27e-11eb-8ee2-9d0071f013ff.png)
![Split image](https://user-images.githubusercontent.com/31478985/120250621-2017d500-c27f-11eb-9eb5-ef0338e0c8bf.png)


### Bugs, errors, feedback?

Open an issue here or contact me via the links on www.christofferlund.com

Thanks for checking out my app!


## For developers


### Build it yourself

Clone the repo, run `yarn` to install dependencies and then you can create installers for your OS. On Windows run `yarn dist:win`, for Mac run `yarn dist:mac` and `yarn dist:linux` for Linux (untested). That will create a dist-folder containing the app to run.

### Running dev version locally

I recommend using `yarn`. Run scripts in the project directory. First run `yarn` to install dependencies. . If you want to use `npm` you must swap out `yarn` for `npm run` in the scripts.

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

### Where are the tests?

Eeeh. It's a prototype and I just needed it up and running fast so I didn't bother. Unless a lot people suddenly started using the app it's not gonna happen.


