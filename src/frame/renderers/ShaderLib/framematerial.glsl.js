import frameBorderParsVertexGlsl from '../ShaderChunk/frame-border.pars.vertex.glsl';
import frameBorderVertexGlsl from '../ShaderChunk/frame-border.vertex.glsl';
import frameBackgroundParsFragmentGlsl from '../ShaderChunk/frame-background.pars.fragment.glsl';
import frameBorderParsFragmentGlsl from '../ShaderChunk/frame-border.pars.fragment.glsl';
import frameCommonParsFragmentGlsl from '../ShaderChunk/frame-common.pars.fragment.glsl';
import frameBackgroundFragmentGlsl from '../ShaderChunk/frame-background.fragment.glsl';
import frameBorderFragmentGlsl from '../ShaderChunk/frame-border.fragment.glsl';

export const vertexShader = /* glsl */`
// Would be automatic on three materials and from USE_UV
#ifdef USE_MAP
varying vec2 vUv;
#endif

${frameBorderParsVertexGlsl}

#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#ifdef USE_MAP
	vUv = uv;
	#endif

	#include <color_vertex>

	${frameBorderVertexGlsl}

	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	gl_Position = projectionMatrix * mvPosition;

	#include <clipping_planes_vertex>
	#include <fog_vertex>

}
`

export const fragmentShader = /* glsl */`

// Basic
uniform vec3 diffuse;
uniform float opacity;

#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif

${frameCommonParsFragmentGlsl}

${frameBorderParsFragmentGlsl}


#ifdef USE_MAP
varying vec2 vUv;
uniform sampler2D map;
#endif

${frameBackgroundParsFragmentGlsl}

#include <color_pars_fragment>
#include <fog_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	vec4 diffuseColor = vec4( diffuse, opacity );


	// map
	${frameBackgroundFragmentGlsl}

	${frameBorderFragmentGlsl}

	#include <color_fragment>

	#ifdef USE_ALPHATEST

	if ( diffuseColor.a < alphaTest ) discard;

	#endif

	// output
	gl_FragColor = diffuseColor;


	#include <clipping_planes_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}
`
