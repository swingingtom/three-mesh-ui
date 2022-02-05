import {MeshPhysicalMaterial, MeshStandardMaterial} from "three";
import alphaglyph_pars_vertex from "../../src/renderers/shaders/ShaderChunks/alphaglyph_pars_vertex.glsl";
import alphaglyph_vertex from "../../src/renderers/shaders/ShaderChunks/alphaglyph_vertex.glsl";
import offsetglyph_vertex from "../../src/renderers/shaders/ShaderChunks/offsetglyph_vertex.glsl";
import alphaglyph_pars_fragment from "../../src/renderers/shaders/ShaderChunks/alphaglyph_pars_fragment.glsl";
import alphaglyph_fragment from "../../src/renderers/shaders/ShaderChunks/alphaglyph_fragment.glsl";
import FontMaterialUtils from "./FontMaterialUtils";

export default class FontPhysicalMaterial extends MeshPhysicalMaterial{

    constructor(options = {}) {

        // default options
        options.transparent = true;
        options.alphaTest = options.alphaTest || 0.02;

        super(options);

        FontMaterialUtils.ensureDefines(this);

        this.userData.glyphMap = {value: options.glyphMap};
        this.userData.u_pxRange = {value: options.u_pxRange || 4};

        this.onBeforeCompile = shader => {

            shader.uniforms.glyphMap = this.userData.glyphMap;
            shader.uniforms.u_pxRange = this.userData.u_pxRange;


            // vertex pars
            shader.vertexShader = shader.vertexShader.replace(
                '#include <uv_pars_vertex>',
                '#include <uv_pars_vertex>\n'+ alphaglyph_pars_vertex
            );

            // vertex chunks
            shader.vertexShader = shader.vertexShader.replace(
                '#include <uv_vertex>',
                '#include <uv_vertex>\n'+ alphaglyph_vertex
            )

            shader.vertexShader = shader.vertexShader.replace(
                '#include <project_vertex>',
                '#include <project_vertex>\n'+ offsetglyph_vertex
            )


            //fragment pars
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <uv_pars_fragment>',
                '#include <uv_pars_fragment>\n'+ alphaglyph_pars_fragment
            )

            // fragment chunks
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <alphamap_fragment>',
                '#include <alphamap_fragment>\n' + alphaglyph_fragment
            )
        }
    }
}