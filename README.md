# nodeP5
mimic P5.js in sdl using nodejs and native-canvas

## usage:
```shell
  npm install native-canvas
```
> & (linux users must have libsdl2-dev installed)

* download NodeP5.js lib from this repo, and create another js file (i.e. index.js)

## index.js
```js
 function setup(){}
 function draw(){}
 require("/path_to_nodep5.js/NodeP5.js")({setup, draw});
```
