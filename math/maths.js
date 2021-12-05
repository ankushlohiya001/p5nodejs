class Maths{
  static angleModer(state, ang, retun = false) {
    if (state._angleMode === Maths.modes.DEGREES) {
      return retun ? ang*(180/Math.PI) : ang*(Math.PI/180);
    }
    return ang;
  }
}

module.exports = Maths; 
