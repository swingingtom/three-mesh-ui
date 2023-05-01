/**
 *
 * @type {string}
 */
const program = /* glsl */`

// FrameBorder vertex pars
attribute vec2 uvB;
varying vec2 vUvB;

#ifdef MULTIPLE_FRAMES

attribute vec2 unitScale;
varying vec2 vUnitScale;

#endif


`;

export default program;
