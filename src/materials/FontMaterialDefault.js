import { Color, ShaderMaterial } from "three";
import { vertexShader, fragmentShader } from "../renderers/shaders/ShaderLib/fontmaterialdefault.glsl";


export default class FontMaterialDefault extends ShaderMaterial {

    constructor( materialOptions = {} ) {

        super( {

            // @TODO: Uniformize names
            uniforms: {
                'glyphMap': { value: materialOptions.u_texture },
                'diffuse': { value: materialOptions.u_color },
                'opacity': { value: materialOptions.u_opacity },
                'u_pxRange': { value: materialOptions.u_pxRange },
                'alphaTest':{ value: 0.02 },
            },
            transparent: true,
            clipping: true,
            alphaTest: 0.5,
            vertexShader,
            fragmentShader,
            extensions: {
                derivatives: true
            },
        } );

        this.needsUpdate = true;

        // initiate additional properties
        this.noRGSS = materialOptions.noRGSS || false;
    }

    /**
     * The color will be the diffuse uniform
     * @returns {*}
     */
    get color() {
        return this.uniforms.diffuse.value;
    }

    set color( v ) {
        this.uniforms.diffuse.value = v;
    }

    /**
     * Opacity stays opacity uniform
     * @param v
     */
    set opacity( v ) {
        if ( this.uniforms )
            this.uniforms.opacity.value = v;
    }

    /**
     * glyphMap will be u_texture => to be update, stays on glyphMap
     * @returns {*}
     */
    get glyphMap() {
        return this.uniforms.glyphMap.value;
    }

    set glyphMap( v ) {
        this.uniforms.glyphMap.value = v;
    }

    /**
     * Is this a default fontMaterial instance
     * @returns {boolean}
     */
    get isDefault() {
        return true;
    }
}