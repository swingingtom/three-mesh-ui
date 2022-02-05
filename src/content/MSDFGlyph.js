
import { BufferAttribute, PlaneBufferGeometry } from 'three';

/**
 * Job: create a plane geometry with the right UVs to map the MSDF texture on the wanted glyph.
 *
 * Knows: dimension of the plane to create, specs of the font used, glyph requireed
 */
export default class MSDFGlyph extends PlaneBufferGeometry {

    constructor( inline, font, segments = 1 ) {

        const char = inline.glyph;
        const fontSize = inline.fontSize;

        // default w & h segments
        let wS = 1, hS=1;
        // If charOBJ, try to distribute segments proportionally
        const charOBJ = font.chars.find( charOBJ => charOBJ.char === char );
        if( charOBJ ){
            wS = Math.ceil((charOBJ.width / font.info.size) * segments);
            hS = Math.ceil((charOBJ.height / font.info.size) * segments);
        }
        super( fontSize, fontSize, wS, hS );

        // Misc glyphs
        if ( char.match(/\s/g) === null ) {

            if ( font.info.charset.indexOf( char ) === -1 ) console.error(`The character '${ char }' is not included in the font characters set.`)

            this.mapUVs( font, char );

            this.transformGeometry( font, fontSize, char, inline );

        // White spaces (we don't want our plane geometry to have a visual width nor a height)
        } else {

            this.nullifyUVs();

            this.scale( 0, 0, 1 );
            this.translate( 0, fontSize / 2, 0 );

        }

    }

    /**
     * Compute the right UVs that will map the MSDF texture so that the passed character
     * will appear centered in full size
     * @private
     */
    mapUVs( font, char ) {

        const charOBJ = font.chars.find( charOBJ => charOBJ.char === char );

        const common = font.common;

        const xMin = charOBJ.x / common.scaleW;

        const xMax = (charOBJ.x + charOBJ.width ) / common.scaleW;

        const yMin =  1 -((charOBJ.y + charOBJ.height ) / common.scaleH);

        const yMax = 1 - (charOBJ.y / common.scaleH);

        const width = xMax - xMin;
        const height = yMax - yMin;

        //


        const originalUvArray = this.getAttribute('uv').array.slice()

        // const uvAttribute = this.attributes.uv;
        //
        // for ( let i = 0; i < uvAttribute.count; i ++ ) {
        //
        //     let u = uvAttribute.getX( i );
        //     let v = uvAttribute.getY( i );
        //
        //     u = xMin + width * u;
        //     v = yMin + height * v;
        //
        //     uvAttribute.setXY( i, u , v );
        //
        // }


        const uvGlyph = [];
        for (let i = 0; i < originalUvArray.length; i += 2) {
            const u = originalUvArray[i];
            const v = originalUvArray[i + 1];

            uvGlyph.push(xMin + width * u);
            uvGlyph.push(yMin + height * v);
        }
        this.setAttribute('uvG', new BufferAttribute(new Float32Array(uvGlyph), 2));

    }

    /** Set all UVs to 0, so that none of the glyphs on the texture will appear */
    nullifyUVs() {

        // const uvAttribute = this.attributes.uv;
        //
        // for ( let i = 0; i < uvAttribute.count; i ++ ) {
        //
        //     uvAttribute.setXY( i, 0, 0 );
        //
        // }

        const uvGlyph = [];
        const length = this.getAttribute('uv').array.length;
        for ( let i = 0; i < length; i++ ) {
            uvGlyph.push(0);
        }
        this.setAttribute('uvG', new BufferAttribute(new Float32Array(uvGlyph), 2));

    }

    /** Gives the previously computed scale and offset to the geometry */
    transformGeometry( font, fontSize, char, inline ) {

        const charOBJ = font.chars.find( charOBJ => charOBJ.char === char );

        const common = font.common;

        const newHeight = charOBJ.height / common.lineHeight;
        const newWidth = (charOBJ.width * newHeight) / charOBJ.height;

        this.scale(
            newWidth,
            newHeight,
            1
        );

        //

        this.translate(
            inline.width / 2,
            ( inline.height / 2 ) - inline.anchor,
            0
        );

    }

}
