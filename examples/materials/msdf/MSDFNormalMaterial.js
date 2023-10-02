import { MeshNormalMaterial } from 'three';
import { MSDFFontMaterialUtils, ShaderChunkUI } from 'three-mesh-ui';
import {emptyBeforeCompile} from "three-mesh-ui/src/font/msdf/utils/MSDFFontMaterialUtils";

/**
 * Example of enabling MeshNormalMaterial to render ThreeMeshUI MSDF Texts
 */
export default class MSDFNormalMaterial extends MeshNormalMaterial{


	/**
	 * This static method is mandatory for extending ThreeMeshUI.MSDFFontMaterial
	 * It will provide a transfer description for properties from ThreeMeshUI.Text to THREE.Material
	 * @see {MSDFFontMaterialUtils.mediation}
	 * @override
	 * @returns {Object.<{m:string, t?:(fontMaterial:Material|ShaderMaterial, materialProperty:string, value:any) => void}>}
	 */
	static get mediation() {

		return MSDFFontMaterialUtils.mediation;

	}

	constructor( options = {}, onBeforeCompile = emptyBeforeCompile ) {

		MSDFFontMaterialUtils.ensureMaterialOptions( options );

		super( options );

		MSDFFontMaterialUtils.ensureDefines( this );

		MSDFFontMaterialUtils.ensureUserData( this, options );

		this.onBeforeCompile = shader => {

			MSDFFontMaterialUtils.bindUniformsWithUserData( shader, this );

			MSDFFontMaterialUtils.injectVertexShaderChunks( shader );


			// Manually add fragments chunks
			// MeshNormalMaterial differ from other materials,
			// so MSDFFontMaterialUtils.injectFragmentShaderChunks() won't apply here

			//fragment pars
			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <normalmap_pars_fragment>',
				`#include <normalmap_pars_fragment>
vec4 diffuseColor;
uniform float alphaTest;

${ShaderChunkUI.msdfAlphaglyphParsFragmentGlsl}`
			);

			// fragment
			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <normal_fragment_maps>',
				`#include <normal_fragment_maps>
diffuseColor = vec4( packNormalToRGB( normal ), opacity );
${ShaderChunkUI.msdfAlphaglyphFragmentGlsl}`
			);

			// output
			shader.fragmentShader = shader.fragmentShader.replace(
				'gl_FragColor = vec4( packNormalToRGB( normal ), opacity );',
				`if( diffuseColor.a < alphaTest ) discard;
                gl_FragColor = diffuseColor;`
			)

			onBeforeCompile( shader, this );

		}

	}

}
