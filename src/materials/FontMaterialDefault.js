import {ShaderMaterial} from "three";
import {vertexShader,fragmentShader} from "../renderers/shaders/ShaderLib/fontmaterialdefault.glsl";


export default class FontMaterialDefault extends ShaderMaterial{

    constructor(materialOptions = {}) {

        super({
            uniforms: {
                'u_texture': { value: materialOptions.u_texture },
                'u_color': { value: materialOptions.u_color }, // color property automatically set to uniform diffuse
                'u_opacity': { value: materialOptions.u_opacity },// already a ShaderMaterial property
                'u_pxRange': { value: materialOptions.u_pxRange },
            },
            // opacity: materialOptions.u_opacity,
            // color: materialOptions.u_color,
            transparent: true,
            clipping: true,
            vertexShader,
            fragmentShader,
            extensions: {
                derivatives: true
            }
        });

        // use_RGSS has been inverted to noRGSS
        // and passed as a preprocessor.
        //      + it gains a if() per voxel
        //      + it allows customized material to fallback on RGSS per default
        this._noRGSS = materialOptions.noRGSS || false;

        // Preprocessor
        if( this._noRGSS ){
            this.defines['NO_RGSS'] = true;
        }
    }

    get color(){ return this.uniforms.u_color.value;}
    set color(v){
        this.uniforms.u_color.value = v;
    }

    get isDefault(){
        return true;
    }

    get noRGSS(){ return this._noRGSS; }
    set noRGSS(value){
        this._noRGSS = value;

        // update Preprocessor
        if( this._noRGSS ){
            this.defines['NO_RGSS'] = '';
        }else{
            delete this.defines['NO_RGSS'];
        }

        // refresh this material
        this.needsUpdate = true;
    }
}