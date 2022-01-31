
import { Object3D } from 'three';

import InlineComponent from './core/InlineComponent.js';
import MeshUIComponent from './core/MeshUIComponent.js';
import FontLibrary from './core/FontLibrary.js';
import TextManager from './core/TextManager.js';
import MaterialManager from './core/MaterialManager.js';

import deepDelete from '../utils/deepDelete.js';
import { mix } from '../utils/mix.js';
import Whitespace from "../utils/Whitespace";
import FontMaterialDefault from "../materials/FontMaterialDefault";


/**
 * Transfer table of ThreeMeshUI.Text properties to its font Material
 * @type {{p,m}[]}
 */
const _textMaterialProperties = [
    { p: "fontColor", m: 'color' }, // the property fontColor goes to material.color
    { p: "fontOpacity", m: 'opacity' } // the property fontOpacity goes to material.opacity
];

/**

 Job:
 - computing its own size according to user measurements or content measurement
 - creating 'inlines' objects with info, so that the parent component can organise them in lines

 Knows:
 - Its text content (string)
 - Font attributes ('font', 'fontSize'.. etc..)
 - Parent block

 */
export default class Text extends mix.withBase( Object3D )(
    InlineComponent,
    TextManager,
    MeshUIComponent
) {

    constructor( options ) {

        super( options );

        this.isText = true;

        // Text already own its fontMaterial property with defaults values
        this._fontMaterial = new FontMaterialDefault( {
            'u_texture': this.getFontTexture(),
            'u_color': this.getFontColor(),
            'u_opacity': this.getFontOpacity(),
            'u_pxRange': this.getFontPXRange(),
            'noRGSS': !this.getFontSupersampling()
        } );

        // during set properties are passed to material
        this.set( options );

    }

    ///////////
    // GETTERS & SETTERS
    ///////////

    get fontMaterial() {
        return this._fontMaterial;
    }

    set fontMaterial( fontMaterial ) {
        // @TODO : place the glyphMap on it
        this._fontMaterial = fontMaterial;
        this._fontMaterial.color = this.getFontColor();
        this._fontMaterial.opacity = this.getFontOpacity();

        // update children to use new fontMaterial
        // this seems to be automatically done
    }

    /////////////
    // OVERRIDES
    /////////////

    /**
     * According to the list of materialProperties
     * some properties are sent to material
     * @param options
     * @private
     */
    _setMaterialProperties( options ) {
        // Transfer properties to material
        if ( this._fontMaterial ) {

            for ( let i = 0; i < _textMaterialProperties.length; i++ ) {
                const tTMP = _textMaterialProperties[i];
                if ( options[tTMP.p] !== undefined ) {
                    this.fontMaterial[tTMP.m] = options[tTMP.p];
                }
            }


            if ( options['fontSupersampling'] !== undefined ) {

                console.log("fontSuperSampling");
                /**
                 * use_RGSS has been inverted to noRGSS and passed as a webgl preprocessor.
                 *       + it gains one if() per voxel
                 *       + it allows customized material to fallback on RGSS per default
                 *         instead of explicitly requiring noRGSS property implementation
                 */
                if ( !options['fontSupersampling'] ) {
                    this._fontMaterial.defines['NO_RGSS'] = '';
                } else {
                    delete this._fontMaterial.defines['NO_RGSS'];
                }
                this._fontMaterial.needsUpdate = true;
            }
        }
    }

    ///////////
    // UPDATES
    ///////////


    /**
     * As font can be defined and loaded by Parent
     * Always refresh glyphMap when creating a Text geometry
     * @private
     */
    _refreshMaterial() {
        // Most of properties are transferred by MeshUIComponent set(options):<Transfer properties to material>
        // what will only remain then will be glyphMap (u_texture).
        // this UpdateTextMaterial will look like an exception for u_texture.
        // therefore a better way for glyphMap should be found.
        if ( this._fontMaterial.isDefault ) {
            this._fontMaterial.glyphMap = this.getFontTexture();
        } else {
            this._fontMaterial.userData.glyphMap.value = this.getFontTexture();
        }

        this._setMaterialProperties( {
            fontColor: this.getFontColor(),
            fontPXRange: this.getFontPXRange(),//@TODO should we go as const?
            fontSupersampling: this.getFontSupersampling()
        } );
    }

    /**
     * Here we compute each glyph dimension, and we store it in this
     * component's inlines parameter. This way the parent Block will
     * compute each glyph position on updateLayout.
     */
    parseParams() {
        this.calculateInlines( this._fitFontSize || this.getFontSize() );
    }


    /**
     * Create text content
     *
     * At this point, text.inlines should have been modified by the parent
     * component, to add xOffset and yOffset properties to each inlines.
     * This way, TextContent knows were to position each character.
     */
    updateLayout() {

        deepDelete( this );

        if ( this.inlines ) {

            // happening in TextManager
            this.textContent = this.createText();

            this.add( this.textContent );

        }

        this.position.z = this.getOffset();

    }

    updateInner() {

        this.position.z = this.getOffset();

        console.log("updateInner");
        if ( this.textContent && this._fontMaterial ) {

            // also refresh the glyphMap
            this._refreshMaterial();

        }

    }

    calculateInlines( fontSize ) {

        const content = this.content;
        const font = this.getFontFamily();
        const breakChars = this.getBreakOn();
        const textType = this.getTextType();
        const whiteSpace = this.getWhiteSpace();

        // Abort condition

        if ( !font || typeof font === 'string' ) {
            if ( !FontLibrary.getFontOf( this ) ) console.warn( 'no font was found' );
            return
        }

        if ( !this.content ) {
            this.inlines = null
            return
        }

        if ( !textType ) {
            console.error( `You must provide a 'textType' attribute so three-mesh-ui knows how to render your text.\n See https://github.com/felixmariotto/three-mesh-ui/wiki/Using-a-custom-text-type` )
            return
        }

        // collapse whitespace for white-space normal
        let whitespaceProcessedContent = Whitespace.collapseContent( content, whiteSpace );
        const chars = Array.from ? Array.from( whitespaceProcessedContent ) : String( whitespaceProcessedContent ).split( '' );


        // Compute glyphs sizes

        const SCALE_MULT = fontSize / font.info.size;
        const lineHeight = font.common.lineHeight * SCALE_MULT;
        const lineBase = font.common.base * SCALE_MULT;

        const glyphInfos = chars.map( ( glyph ) => {

            // Get height, width, and anchor point of this glyph
            const dimensions = this.getGlyphDimensions( {
                textType,
                glyph,
                font,
                fontSize
            } );

            //

            let lineBreak = null;

            if ( breakChars.includes( glyph ) || glyph.match( /\s/g ) ) lineBreak = "possible";


            if ( glyph.match( /\n/g ) ) {
                lineBreak = Whitespace.newlineBreakability( whiteSpace );
            }

            //

            return {
                height: dimensions.height,
                width: dimensions.width,
                anchor: dimensions.anchor,
                xadvance: dimensions.xadvance,
                xoffset: dimensions.xoffset,
                lineBreak,
                glyph,
                fontSize,
                lineHeight,
                lineBase
            };

        } );

        // apply kerning
        if ( this.getFontKerning() !== 'none' ) {

            // First character won't be kerned with its void lefthanded peer
            for ( let i = 1; i < glyphInfos.length; i++ ) {

                const glyphInfo = glyphInfos[i];
                const glyphPair = glyphInfos[i - 1].glyph + glyphInfos[i].glyph;

                // retrieve the kerning from the font
                const kerning = this.getGlyphPairKerning( textType, font, glyphPair );

                // compute the final kerning value according to requested fontSize
                glyphInfo['kerning'] = kerning * ( fontSize / font.info.size );

            }
        }


        // Update 'inlines' property, so that the parent can compute each glyph position

        this.inlines = glyphInfos;
    }

}
