import { MeshStandardMaterial } from "three";
import alphaglyph_pars_vertex from "../../src/renderers/shaders/ShaderChunks/alphaglyph_pars_vertex.glsl";
import alphaglyph_vertex from "../../src/renderers/shaders/ShaderChunks/alphaglyph_vertex.glsl";
import offsetglyph_vertex from "../../src/renderers/shaders/ShaderChunks/offsetglyph_vertex.glsl";
import alphaglyph_pars_fragment from "../../src/renderers/shaders/ShaderChunks/alphaglyph_pars_fragment.glsl";
import alphaglyph_fragment from "../../src/renderers/shaders/ShaderChunks/alphaglyph_fragment.glsl";
import FontMaterialUtils from "./FontMaterialUtils";

export default class FontStandardMaterial extends MeshStandardMaterial {

    constructor( options = {} ) {

        // three-mesh-ui font material requires
        // some material options to be set as default
        // in order to work properly
        FontMaterialUtils.ensureMaterialOptions( options )

        super( options );

        // three-mesh-ui font material requires
        // some webgl preprocessor to be set
        // in order to work properly
        FontMaterialUtils.ensureDefines( this );

        // three-mesh-ui font material requires
        // some userData properties to be set
        // in order to work properly
        FontMaterialUtils.ensureUserData( this, options );

        // three-mesh-ui custom font material can be achieve
        // by modifying the shader before its compilation
        this.onBeforeCompile = shader => {

            // three-mesh-ui font material shader requires
            // uniforms to be bound with userData properties
            FontMaterialUtils.bindUniformsWithUserData(shader,this);

            // VERTEX SHADER
            // three-mesh-ui font material shader requires
            // shader chunks to be inject in vertex shader

            // vertex pars
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


            // FRAGMENT SHADER
            // three-mesh-ui font material shader requires
            // shader chunks to be inject in fragment shader

            //fragment pars
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
    }
}