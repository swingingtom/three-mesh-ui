import alphaglyph_pars_vertex from "three-mesh-ui/renderers/shaders/ShaderChunks/alphaglyph_pars_vertex.glsl";
import alphaglyph_vertex from "three-mesh-ui/renderers/shaders/ShaderChunks/alphaglyph_vertex.glsl";
import offsetglyph_vertex from "three-mesh-ui/renderers/shaders/ShaderChunks/offsetglyph_vertex.glsl";
import alphaglyph_pars_fragment from "three-mesh-ui/renderers/shaders/ShaderChunks/alphaglyph_pars_fragment.glsl";
import alphaglyph_fragment from "three-mesh-ui/renderers/shaders/ShaderChunks/alphaglyph_fragment.glsl";
import { ALPHA_TEST, PX_RANGE } from "three-mesh-ui/materials/FontMaterialDefault";

/**
 * FontMaterialUtils provides utilities
 * for customizing other threejs or custom materials
 * into a three-mesh-ui FontMaterial
 */
export default class FontMaterialUtils {

    /**
     * Alter a material options with required fontMaterial options and or default values
     * @param {Object} materialOptions
     */
    static ensureMaterialOptions( materialOptions ) {
        materialOptions.transparent = true;
        materialOptions.alphaTest = materialOptions.alphaTest || ALPHA_TEST;
    }

    /**
     * As three-mesh-ui FontMaterial relies on webgl preprocessors,
     * lets force the material to have a proper defines object
     * @param {Material} threeMaterial
     */
    static ensureDefines( threeMaterial ) {
        if ( !threeMaterial.defines ) {
            threeMaterial.defines = {};
        }
    }

    /**
     *
     * @param {Material} threeMaterial
     * @param {Object} materialOptions
     */
    static ensureUserData( threeMaterial, materialOptions ) {
        threeMaterial.userData.glyphMap = { value: materialOptions.glyphMap };
        threeMaterial.userData.u_pxRange = { value: materialOptions.u_pxRange || PX_RANGE };
    }

    /**
     *
     * @param {*} shader
     * @param {Material} threeMaterial
     */
    static bindUniformsWithUserData( shader, threeMaterial ) {

        shader.uniforms.glyphMap = threeMaterial.userData.glyphMap;
        shader.uniforms.u_pxRange = threeMaterial.userData.u_pxRange;
    }

    /**
     *
     * @param shader
     */
    static injectShaders( shader ) {
        FontMaterialUtils.injectVertexShaderChunks( shader );
        FontMaterialUtils.injectFragmentShaderChunks( shader );
    }

    /**
     *
     * @param shader
     */
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

    /**
     *
     * @param shader
     */
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

    /**
     * Mix a threejs Material into a three-mesh-ui FontMaterial
     * @param {Class} materialClass
     * @returns {Material}
     */
    static from( materialClass ) {
        return class extends materialClass {

            constructor( options = {} ) {

                // same as FontMaterial extension
                FontMaterialUtils.ensureMaterialOptions( options );
                super( options );
                FontMaterialUtils.ensureDefines( this );
                FontMaterialUtils.ensureUserData( this, options );

                // defines two internal properties in order to kept
                // user allowed to use onBeforeCompile for its own stuff
                // 1- store an callback for user
                this._userDefinedOnBeforeCompile = shader => {};
                // 2- store the cumulative callback
                this._onBeforeCompile = this._cumulativeOnBeforeCompile.bind( this );
            }

            ////////////////////////////
            // OnBeforeCompile Override
            ///////////////////////////

            /**
             * Override the setter of onBeforeCompile in order to never overwrite
             * the three-mesh-ui fontMaterial onBeforeCompile
             * @param fct
             */
            set onBeforeCompile( fct ) {
                // only store it as userDefinedCallback
                this._userDefinedOnBeforeCompile = fct;
            }

            /**
             * Override the getter of onBeforeCompile in order to
             * always deliver the cumulativeCallbacks to threejs
             * @returns {*}
             */
            get onBeforeCompile() {
                return this._onBeforeCompile;
            }

            /**
             * @TODO : Change babel rules in order to allows _cumulativeOnBeforeCompile = (shader) => {}
             * On before compile that first run three-mesh-ui fontMaterial
             * then user defined onBeforeCompile
             * @param shader
             * @private
             */
            _cumulativeOnBeforeCompile( shader ) {
                // bind uniforms
                FontMaterialUtils.bindUniformsWithUserData( shader, this );

                // inject both vertex and fragment shaders
                FontMaterialUtils.injectShaders( shader );

                // user defined additional onBeforeCompile
                this._userDefinedOnBeforeCompile( shader );
            }
        }
    }
}