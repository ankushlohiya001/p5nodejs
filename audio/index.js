const load=require("audio-loader");
const play=require("audio-play");
class Sound{
  constructor(){
    this._audioBuffer=null;
    this._duration=0;
    this._sampleRate=0;
    this._channels=0;
    this._playBack=null;
    this._isPlaying=false;
    this._willLoop=false;
    this._volume=1;
  }

  get duration(){
    return this._duration;
  }

  get sampleRate(){
    return this._sampleRate;
  }

  get channels(){
    return this._channels;
  }

  get audioBuffer(){
    return this._audioBuffer;
  }

  get currentTime(){
    return this._audioBuffer.currentTime;
  }

  isLoaded(){
    return this._audioBuffer!==null;
  }

  isPlaying(){
    return this._isPlaying;
  }

  isPaused(){
    return !this._isPlaying;
  }

  isLooping(){
    return this._willLoop;
  }

  setLoop(loop){
    this._willLoop=!!loop;
  }

  setVolume(value){
    this._volume=value;
  }

  setBuffer(buff){
    this._audioBuffer=buff;
    this._duration=buff.duration;
    this._sampleRate=buff.sampleRate;
    this._channels=buff.numberOfChannels;
  }

  play(startTime, rate, duration){
    startTime=startTime||0;
    rate=rate||1;
    duration=duration||this._audioBuffer.duration;
    if(this.isLoaded()){
        this._playBack=play(this._audioBuffer,{
         loop: this._willLoop,
         start: startTime,
         rate,
         end: duration,
         volume: this._volume,
         autoplay: true
        }, ()=>{
          this._isPlaying=!this._isPlaying;
          this.onended();
        });
      this._isPlaying=true;
    }
  }

  pause(){
    if(this._playBack && this.isPlaying()){
      this._playBack.pause();
      this._isPlaying=false;
    }
  }

  onended(){}

  stop(){}

  static loadSound(buf){
    return load(buf);
  }
}

module.exports=Sound;