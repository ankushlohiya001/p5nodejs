# nodeP5
mimic P5.js in sdl using nodejs and native-canvas
## usage:
```shell
  npm install native-canvas
```
> & (linux users must have libsdl2-dev installed)

* download NodeP5.js lib from this repo, and create another js file (i.e. index.js)
## why not npm module?
> becuase it's still not completed to extent that it can be uploaded as npm package
> and secondly i'm learning ;)

## index.js
```js
 function setup(){}
 function draw(){}
 require("/path_to_nodep5.js/NodeP5.js")({setup, draw});
```
## support
 * highly dependant on native-canvas
 * thanks to native-canvas module developer

### for updated source, check release tab
