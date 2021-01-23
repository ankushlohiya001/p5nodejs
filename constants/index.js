let mods = [
    /*<ColorModes >*/
    'RGB',
    'HSL',
    'HSB',
    /*<CapModes >*/
    'ROUND',
    'SQUARE',
    'PROJECT',
    /*<JoinModes >*/
    'MITER',
    'BEVEL',
    /*<RectModes,EllipseModes,ImageModes >*/
    'CORNER',
    'CORNERS',
    'RADIUS',
    /*<AlignModes >*/
    'TOP',
    'BOTTOM',
    'CENTER',
    'BASELINE',
    'LEFT',
    'RIGHT',
    /*<BlendModes >*/
    'BLEND',
    'DARKEST',
    'LIGHTEST',
    'DIFFERENCE',
    'MULTIPLY',
    'EXCLUSION',
    'SCREEN',
    'REPLACE',
    'OVERLAY',
    'HARD_LIGHT',
    'SOFT_LIGHT',
    'DODGE',
    'BURN',
    'ADD',
    'REMOVE',
    'SUBTRACT',
    /*<TextStyles>*/
    'NORMAL',
    'ITALIC',
    'BOLD',
    'BOLDITALIC',
    /*<AngleModes>*/
    'RADIANS',
    'DEGREES',
    /*<ArcModes>*/
    'CHORD',
    'PIE',
    'OPEN',
    /*<ShapeModes>*/
    'POINTS',
    'LINES',
    'TRIANGLES',
    'TRIANGLE_FAN',
    'TRIANGLE_STRIP',
    'QUADS',
    'QUAD_STRIP',
    'CLOSE',
    /*<Cursor types>*/
    'ARROW',
    'CROSS',
    'HAND',
    'MOVE',
    'TEXT',
    'WAIT'
];
let GlobalConstants = {};
for(let mod of mods){
  Object.defineProperty(GlobalConstants, mod, {
        value: Symbol(mod),
        writable: false,
        configurable: false,
        enumerable: true
    });
}
module.exports=GlobalConstants;