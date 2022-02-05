import alphaglyph_pars_vertex from "three-mesh-ui/renderers/shaders/ShaderChunks/alphaglyph_pars_vertex.glsl";
import alphaglyph_vertex from "three-mesh-ui/renderers/shaders/ShaderChunks/alphaglyph_vertex.glsl";
import offsetglyph_vertex from "three-mesh-ui/renderers/shaders/ShaderChunks/offsetglyph_vertex.glsl";
import alphaglyph_pars_fragment from "three-mesh-ui/renderers/shaders/ShaderChunks/alphaglyph_pars_fragment.glsl";
import alphaglyph_fragment from "three-mesh-ui/renderers/shaders/ShaderChunks/alphaglyph_fragment.glsl";

export default class FontMaterialUtils {

    static ensureMaterialOptions( materialOptions ) {
        materialOptions.transparent = true;
        materialOptions.alphaTest = materialOptions.alphaTest || 0.02;
    }

    static ensureDefines( threeMaterial ) {
        if ( !threeMaterial.defines ) {
            threeMaterial.defines = {};
        }
    }

    static ensureUserData( threeMaterial, materialOptions ) {
        threeMaterial.userData.glyphMap = { value: materialOptions.glyphMap };
        threeMaterial.userData.u_pxRange = { value: materialOptions.u_pxRange || 4 };
    }

    static bindUniformsWithUserData( shader, threeMaterial ) {

        shader.uniforms.glyphMap = threeMaterial.userData.glyphMap;
        shader.uniforms.u_pxRange = threeMaterial.userData.u_pxRange;
    }

    static injectShaders( shader ){
        FontMaterialUtils.injectVertexShaderChunks(shader);
        FontMaterialUtils.injectFragmentShaderChunks(shader);
    }

    static injectVertexShaderChunks( shader ) {
        shader.vertexShader = shader.vertexShader.replace(
            '#include <uv_pars_vertex>',
            '#include <uv_pars_vertex>\n' + alphaglyph_pars_vertex
        );

        // vertex chunks
        shader.vertexShader = shader.vertexShader.replace(
            '#include <uv_vertex>',
            '#include <uv_vertex>\n' + alphaglyph_vertex
        )

        shader.vertexShader = shader.vertexShader.replace(
            '#include <project_vertex>',
            '#include <project_vertex>\n' + offsetglyph_vertex
        )
    }

    static injectFragmentShaderChunks( shader ) {
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <uv_pars_fragment>',
            '#include <uv_pars_fragment>\n' + alphaglyph_pars_fragment
        )

        // fragment chunks
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <alphamap_fragment>',
            '#include <alphamap_fragment>\n' + alphaglyph_fragment
        )
    }

    static from( materialClass ) {
        return class extends materialClass {

            constructor( options = {} ) {
                FontMaterialUtils.ensureMaterialOptions( options );
                super( options );
                FontMaterialUtils.ensureDefines( this );
                FontMaterialUtils.ensureUserData( this, options );

                this._userDefinedOnBeforeCompile = shader => {};
                this._onBeforeCompile = this._cumulativeOnBeforeCompile.bind(this);
            }

            set onBeforeCompile( fct ){
                this._userDefinedOnBeforeCompile = fct;
            }

            get onBeforeCompile(){
                return this._onBeforeCompile;
            }

            _cumulativeOnBeforeCompile(shader) {
                // bind uniforms
                FontMaterialUtils.bindUniformsWithUserData( shader, this );

                // inject both vertex and fragment shaders
                FontMaterialUtils.injectShaders( shader );

                // user defined additional onBeforeCompile
                this._userDefinedOnBeforeCompile(shader);
            }
        }
    }
}