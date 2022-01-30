export const vertexShader = /* glsl */`

// TMU <uvGlyph_pars_vertex>
varying vec2 vUv;

#include <clipping_planes_pars_vertex>

void main() {

	// TMU <uvGlyph_vertex>
	vUv = uv;

	// <project_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	gl_Position = projectionMatrix * mvPosition;


	// TMU <offsetGlyph_vertex>
	gl_Position.z -= 0.00001;

	#include <clipping_planes_vertex>

}
`

export const fragmentShader = /* glsl */`


// <color_pars_fragment> : vec3|vec4 named varying vec3 vColor;
uniform vec3 u_color; // should be called diffuse instead

// TMU <uvGlyph_pars_fragment>
varying vec2 vUv;
uniform sampler2D u_texture;
uniform float u_opacity;
uniform float u_pxRange;
uniform bool u_useRGSS;


// functions from the original msdf repo:
// https://github.com/Chlumsky/msdfgen#using-a-multi-channel-distance-field

float median(float r, float g, float b) {
	return max(min(r, g), min(max(r, g), b));
}

float screenPxRange() {
	vec2 unitRange = vec2(u_pxRange)/vec2(textureSize(u_texture, 0));
	vec2 screenTexSize = vec2(1.0)/fwidth(vUv);
	return max(0.5*dot(unitRange, screenTexSize), 1.0);
}

float tap(vec2 offsetUV) {
	vec3 msd = texture( u_texture, offsetUV ).rgb;
	float sd = median(msd.r, msd.g, msd.b);
	float screenPxDistance = screenPxRange() * (sd - 0.5);
	float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
	return alpha;
}

#include <clipping_planes_pars_fragment>

void main() {

	// <color_fragment> : vec4 diffuseColor



	// TMU <alphaGlyph_fragment>
	float alpha;
#ifdef NO_RGSS
		alpha = tap( vUv );
#else

		// shader-based supersampling based on https://bgolus.medium.com/sharper-mipmapping-using-shader-based-supersampling-ed7aadb47bec
		// per pixel partial derivatives
		vec2 dx = dFdx(vUv);
		vec2 dy = dFdy(vUv);

		// rotated grid uv offsets
		vec2 uvOffsets = vec2(0.125, 0.375);
		vec2 offsetUV = vec2(0.0, 0.0);

		// supersampled using 2x2 rotated grid
		alpha = 0.0;
		offsetUV.xy = vUv + uvOffsets.x * dx + uvOffsets.y * dy;
		alpha += tap(offsetUV);
		offsetUV.xy = vUv - uvOffsets.x * dx - uvOffsets.y * dy;
		alpha += tap(offsetUV);
		offsetUV.xy = vUv + uvOffsets.y * dx - uvOffsets.x * dy;
		alpha += tap(offsetUV);
		offsetUV.xy = vUv - uvOffsets.y * dx + uvOffsets.x * dy;
		alpha += tap(offsetUV);
		alpha *= 0.25;
#endif

	// apply the opacity ( on the diffuseColor )
	alpha *= u_opacity;

	// <alphatest_fragment>
	// this is useful to avoid z-fighting when quads overlap because of kerning
	if ( alpha < 0.02) discard;


	gl_FragColor = vec4( u_color, alpha );

	#include <clipping_planes_fragment>
}
`