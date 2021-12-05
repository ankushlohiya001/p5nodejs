const Sketch = require("../");

let loc, wet, temp;
class Clock extends Sketch {
  setup() {
    createWindow();
    angleMode(DEGREES);
    frameRate(1);
    loadJSON("http://api.weatherapi.com/v1/current.json?key=975d6755d5de4a859ef115227212504&q=tosham&aqi=no", data => {
      if (data.error) {
        alert(data.error.message);
        return;
      }
      loc = data.location.name;
      wet = loadImage("http:" + data.current.condition.icon);
      temp = data.current.temp_c;
    });

  }
  draw() {
    background(0);
    strokeWeight(20);
    noFill();
    const time = (new Date);
    const sec = time.getSeconds() + time.getMilliseconds() / 1000;
    const ang = map(sec, 0, 60, -90, 270);

    const min = time.getMinutes() + sec / 60;
    const ang2 = map(min, 0, 60, -90, 270);

    const hr = time.getHours() % 12 + min / 60;
    const ang3 = map(hr, 0, 12, -90, 270);

    stroke(0, 200, 200);
    arc(width / 2, height / 2, 400, 400, -90, ang);
    stroke(200, 200, 0);
    arc(width / 2, height / 2, 340, 340, -90, ang2);
    stroke(200, 0, 200);
    arc(width / 2, height / 2, 280, 280, -90, ang3);

    noStroke();
    fill(200);
    textFont("daniel black", 45);
    textAlign(CENTER, CENTER);
    let [h, m, s] = [time.getHours(), time.getMinutes(), time.getSeconds()];
    text(`${h<10?'0'+h:h} : ${m<10?'0'+m:m}`, width / 2, height / 2 - 50);
    textSize(25);

    if (wet && wet.isLoaded) {
      text(`${temp} C, ${loc}`, width / 2, height / 2 + 10);
      image(wet, width / 2 - wet.width / 2, height / 2 + 10);
    }
  }
}

Clock.run();
