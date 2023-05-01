/**
 *
 * @type {string}
 */
const program = /* glsl */`

	// FrameBorder vertex shader
	vUvB = uvB;

#ifdef MULTIPLE_FRAMES

	vUnitScale = unitScale;

#endif

`;

export default program;
