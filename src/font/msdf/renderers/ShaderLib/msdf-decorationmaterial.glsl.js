import msdfOffsetglyphVertexGlsl from '../ShaderChunks/msdf-offsetglyph.vertex.glsl';

/**
 *
 * @type {string}
 */
export const decorationVertexShader = /* glsl */`
#include <fog_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <begin_vertex>
	#include <project_vertex>
	${msdfOffsetglyphVertexGlsl}
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}
`

/**
 *
 * @type {string}
 */
export const decorationFragmentShader = /* glsl */`
uniform vec3 diffuse;
uniform float opacity;
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	// instead of <color_fragment> : vec4 diffuseColor
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <alphatest_fragment>
	// instead of <output_fragment>
	gl_FragColor = diffuseColor;
	#include <clipping_planes_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}
`
