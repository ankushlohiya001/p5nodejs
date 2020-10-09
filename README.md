# nodeP5
mimic P5.js in sdl using nodejs and native-canvas
## usage:
###dependencies
```shell
  sudo apt install \
  libpixman-1-dev \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  libsdl2-dev
```
###then install
```shell
  npm install p5nodejs
```
## index.js
```js
 function setup(){}
 function draw(){}
 require("p5nodejs")({setup, draw});
```
##other function like preload, mousePressed, keyPressed
```js
require("p5nodejs")({setup,draw,preload,mousePressed,keyPressed})
```
## support
 * highly dependant on native-canvas
 * thanks to native-canvas module developer

### for updated source, check release tab
