import alphaglyph_pars_vertex from "../ShaderChunks/alphaglyph_pars_vertex.glsl";
import alphaglyph_vertex from "../ShaderChunks/alphaglyph_vertex.glsl";
import offsetglyph_vertex from "../ShaderChunks/offsetglyph_vertex.glsl";
import alphaglyph_pars_fragment from "../ShaderChunks/alphaglyph_pars_fragment.glsl";
import alphaglyph_fragment from "../ShaderChunks/alphaglyph_fragment.glsl";

export const vertexShader = /* glsl */`

${alphaglyph_pars_vertex}
#include <clipping_planes_pars_vertex>

void main() {

	${alphaglyph_vertex}

	#include <begin_vertex>
	#include <project_vertex>

	${offsetglyph_vertex}

	#include <clipping_planes_vertex>
}
`

export const fragmentShader = /* glsl */`
uniform vec3 diffuse;
uniform float opacity;

${alphaglyph_pars_fragment}

#include <alphatest_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	// instead of <color_fragment> : vec4 diffuseColor
	vec4 diffuseColor = vec4( diffuse, opacity );

	${alphaglyph_fragment}

	#include <alphatest_fragment>

	// instead of <output_fragment>
	gl_FragColor = diffuseColor;

	#include <clipping_planes_fragment>
}
`