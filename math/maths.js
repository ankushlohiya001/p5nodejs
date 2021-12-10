class Maths{
  
  setRenderer(renderer){
    this.renderer = renderer;
  }

  angleModer(ang, retun = false) {
    const angleMode = this.renderer.state._angleMode;
    if (angleMode === Maths.modes.DEGREES) {
      return retun ? ang*(180/Math.PI) : ang*(Math.PI/180);
    }
    return ang;
  }
}

module.exports = Maths; 
