import BaseProperty from '../BaseProperty';
import { BufferAttribute, Mesh, PlaneGeometry, Vector3 } from 'three';
import FrameMaterial from '../../../frame/materials/FrameMaterial';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils';

export default class RendererPropertyInline extends BaseProperty {

	constructor() {

		super( 'renderer' );

	}


	render( element ) {

		if ( !element._inlines._value || !element._inlines._value.length ) return;

		// convert all inlines (glyphs) to geometries
		const charactersAsGeometries = element._inlines._value.map(
			inline => {
				return element._font._fontVariant.getGeometricGlyph( inline, element )
					.translate( inline.offsetX, inline.offsetY, 0 );
			}
		);


		const fontMesh = element._inlineMerge.apply( charactersAsGeometries, element);
		element.setFontMesh( fontMesh );

		// @TODO : this won't apply
		if( fontMesh.isInlineMesh ) {
			fontMesh.renderOrder = Infinity;
		}
		else
		{
			for (let i = 0; i < fontMesh.length; i++) {
				const fontMesh1 = fontMesh[i];
				fontMesh1.renderOrder = Infinity;
			}
		}


		const FONTSIZE = element._fontSize._value;
		const SCALE_MULT = FONTSIZE / element._font._fontVariant.typographic.size;
		const LINE_HEIGHT = element._font._fontVariant.typographic.lineHeight * SCALE_MULT;
		const LINEBASE = element._font._fontVariant.typographic.lineBase * SCALE_MULT;

		const DELTA = LINE_HEIGHT - LINEBASE;


		// Starts to have a bit too much responsibilities here
		if ( element._verticalAlign._value === 'super' ) {
			element.position.y = LINEBASE * 1.5;
		}else if(element._verticalAlign._value === 'sub'){
			element.position.y = -LINEBASE * 0.6;
		}

		// Background --------------------------------------------------------------

		const inlines = element._inlines._value;
		const lines = [0];
		let lastLineIndex = inlines[0].lineIndex;

		for ( let i = 1; i < inlines.length; i++ ) {

			if( inlines[i].lineIndex === lastLineIndex ) continue;

			lines.push( i-1 );
			lines.push( i );

			lastLineIndex = inlines[i].lineIndex;

		}

		// @TODO : Would be great to have a bit more informations here...
		// be sure lines are even startInline and endInline
		if( lines.length % 2 === 1 ) lines.push( inlines.length-1 );


		if( !element._backgroundNone ) {

			const bgs = [];
			for ( let i = 0; i < lines.length -1 ; i+=2 ) {


				const firstInlineOfLine = inlines[lines[i]];
				const lastInlineOfLine = inlines[lines[i+1]];



				const line = firstInlineOfLine.line;

				const right = lastInlineOfLine.offsetX + lastInlineOfLine.cumulativeWidth + lastInlineOfLine._paddingRight;
				const left = firstInlineOfLine._offsetX - firstInlineOfLine._paddingLeft;

				const width = right - left;
				const height = LINE_HEIGHT;

				const posX = left;
				let posY = lastInlineOfLine.line.y;

				// Check for differences
				if( height < line.lineHeight ){
					posY -= (line.lineHeight - firstInlineOfLine.lineHeight)/4;
				}

				const bgGeo = new PlaneGeometry( width, height ).translate( posX + width/2, posY - lastInlineOfLine.line.lineHeight /2, 0);
				const uvA = bgGeo.getAttribute('uv').array;
				const uvB = new BufferAttribute( new Float32Array( uvA ), 2);
				bgGeo.setAttribute('uvB', uvB ).name = 'uvB';

				const unitScales = uvA.map( (u,i) => i%2 ? height : width );
				bgGeo.setAttribute('unitScale', new BufferAttribute( new Float32Array( unitScales ), 2) );

				bgGeo._scale = new Vector3(width,height,1);
				bgs.push( bgGeo );

			}

			if ( bgs.length ) {

				const mergedVg = mergeGeometries( bgs );

				element.backgroundMaterial = new FrameMaterial();
				element.backgroundMaterial.defines.MULTIPLE_FRAMES = 1;

				const mesh= new Mesh( mergedVg, element.backgroundMaterial )
				element.setBackgroundMesh( mesh );

				mesh.position.z = - element._offset._notInheritedValue / 2;

			}
		}



		// Text Decoration ---------------------------------------------------------

		if( element._textDecoration._value !== 'none') {

			const decos = [];
			const decorations = element._textDecoration._value.split(" ");
			for ( let i = 0; i < decorations.length; i++ ) {
				const decoration = decorations[ i ];

				for ( let j = 0; j < lines.length - 1; j += 2 ) {


					const firstInlineOfLine = inlines[ lines[ j ] ];
					const lastInlineOfLine = inlines[ lines[ j + 1 ] ];

					const decoHeight = FONTSIZE / 10;

					let to = lastInlineOfLine.offsetX + lastInlineOfLine.cumulativeWidth;
					let from = firstInlineOfLine._offsetX;

					let posY;
					if ( decoration === 'underline' ){

						posY = lastInlineOfLine.line.y - LINE_HEIGHT + ( DELTA / 2 ) - decoHeight/2;

						// check all for under
						for ( let k = lines[j]; k <= lines[j+1]; k++ ){

							const inl = inlines[k];

							if( inl.offsetY - inl.height <= posY ){

								if( inlines[k] === firstInlineOfLine ) {
									from = inlines[k].offsetX + inlines[k].underlineFrom;
									continue;
								}

								to = inlines[k].offsetX + inlines[k].underlineTo;
								decos.push( _buildDecorationSegment(from,to,decoHeight, posY))
								from = inlines[k].offsetX + inlines[k].underlineFrom;

								continue;
							}

							if( inlines[k] === lastInlineOfLine ){
								to = inlines[k].offsetX + inlines[k].underlineFrom;
								decos.push( _buildDecorationSegment(from,to,decoHeight, posY))
							}
						}


					} else if( decoration === 'overline' ) {

						posY = lastInlineOfLine.line.y - decoHeight/2;

						decos.push( _buildDecorationSegment(from,to,decoHeight, posY) )

					} else if( decoration === 'line-through' ) {

						// posY = firstInlineOfLine.line.y - LINE_HEIGHT/2 - decoHeight/2;
						posY = firstInlineOfLine.line.y - LINE_HEIGHT/2  - ( DELTA / 2 );



						decos.push( _buildDecorationSegment(from,to,decoHeight, posY) )

					}


				}

			}


			if ( decos.length ) {

				const mergedVg = mergeGeometries( decos );
				const mesh = new Mesh( mergedVg, element.fontMaterial );

				mesh.position.z = +element._offset._notInheritedValue / 4;

				if ( element._decoMesh ) {
					element.remove( element._decoMesh );
				}

				element._decoMesh = mesh;
				element.add( mesh );

			}

		}

	}

}


function _buildDecorationSegment(from, to, height, y ){

	const width = to - from;

	const posX = from;

	const bgGeo = new PlaneGeometry( width, height );

	// AlphaGlyph Attribute - Defines if the geometry is glyph or decoration
	const length = bgGeo.getAttribute('uv').array.length;
	const vertexAlphaGlyph = [];
	for ( let i = 0; i < length; i+=2 ) vertexAlphaGlyph[i/2] = 1.0;

	bgGeo.setAttribute('alphaDecorationFactor', new BufferAttribute(new Float32Array(vertexAlphaGlyph), 1));
	bgGeo.translate( posX + width / 2, y, 0 );

	return bgGeo;
}
