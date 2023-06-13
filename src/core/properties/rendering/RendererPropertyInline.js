import BaseProperty from '../BaseProperty';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { AlwaysDepth, BufferAttribute, DepthModes, DoubleSide, GreaterEqualDepth, GreaterEqualStencilFunc, LessDepth, LessEqualDepth, Mesh, MeshBasicMaterial, PlaneGeometry, Vector3 } from 'three';
import FrameMaterial from '../../../frame/materials/FrameMaterial';
import { UV, WORLD_UNITS } from '../../../utils/Units';
import { NeverDepth } from 'three/src/constants';

export default class RendererPropertyInline extends BaseProperty {

	constructor() {

		super( 'renderer' );

	}


	render( element ) {

		if ( !element._inlines._value || !element._inlines._value.length ) return;

		const charactersAsGeometries = element._inlines._value.map(
			inline => {
				return element._font._fontVariant.getGeometricGlyph( inline, element )
					.translate( inline.offsetX, inline.offsetY, 0 );
			}
		);

		const mergedGeom = mergeBufferGeometries( charactersAsGeometries );

		const fontMesh = new Mesh( mergedGeom, element.fontMaterial );
		element.setFontMesh( fontMesh );

		element._fontMesh.renderOrder = Infinity;


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

		// be sure lines are even startInline and endInline
		if( lines.length % 2 === 1 ) lines.push( inlines.length-1 );


		if( !element._backgroundNone ) {

			const bgs = [];
			for ( let i = 0; i < lines.length -1 ; i+=2 ) {


				const firstInlineOfLine = inlines[lines[i]];
				const lastInlineOfLine = inlines[lines[i+1]];



				const line = firstInlineOfLine.line;

				let right = lastInlineOfLine.offsetX + lastInlineOfLine.cumulativeWidth + lastInlineOfLine._paddingRight;
				let left = firstInlineOfLine._offsetX - firstInlineOfLine._paddingLeft;

				let width = right - left;
				let height = LINE_HEIGHT;

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

				var unitScales = uvA.map( (u,i) => i%2 ? height : width );
				bgGeo.setAttribute('unitScale', new BufferAttribute( new Float32Array( unitScales ), 2) );

				bgGeo._scale = new Vector3(width,height,1);
				bgs.push( bgGeo );

			}

			if ( bgs.length ) {

				const mergedVg = mergeBufferGeometries( bgs );

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

					let decoHeight = FONTSIZE / 12;

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

						posY = lastInlineOfLine.line.y;

						decos.push( _buildDecorationSegment(from,to,decoHeight, posY) )

					} else if( decoration === 'line-through' ) {

						posY = firstInlineOfLine.line.y - LINE_HEIGHT/2 - decoHeight/2;
						decos.push( _buildDecorationSegment(from,to,decoHeight, posY) )

					}





// 					const line = firstInlineOfLine.line;
// // Check for differences
// 					if ( LINE_HEIGHT < line.lineHeight ) {
// 						posY -= ( line.lineHeight - LINE_HEIGHT ) * 0.75;
// 					}


					// let right = lastInlineOfLine.offsetX + lastInlineOfLine.cumulativeWidth;
					// let left = firstInlineOfLine._offsetX;
					//
					// let width = right - left;
					//
					//
					// const posX = left;
					//
					//
					//
					//
					//
					// let bgGeo = new PlaneGeometry( width, decoHeight );
					// bgGeo.translate( posX + width / 2, posY, 0 );
					//
					// decos.push( bgGeo );

				}

			}






			if ( decos.length ) {

				const mergedVg = mergeBufferGeometries( decos );

				if ( !element._fontDecorationMaterial ) {
					if ( element._fontMaterial._notInheritedValue.cloneAsDecorationMaterial ) {
						element._fontDecorationMaterial = element._fontMaterial._notInheritedValue.cloneAsDecorationMaterial();
					} else {
						element._fontDecorationMaterial = element._fontMaterial._notInheritedValue;
					}
				}

				const mesh = new Mesh( mergedVg, element._fontDecorationMaterial );
				// const mesh = new Mesh( mergedVg, new MeshBasicMaterial({color:0x000000}) );
				// mesh.position.z = +element._offset._notInheritedValue / 4;
				// mesh.renderOrder = 15000;

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
	// let right = lastInlineOfLine.offsetX + lastInlineOfLine.cumulativeWidth;
	// let left = firstInlineOfLine._offsetX;

	let width = to - from;


	const posX = from;





	let bgGeo = new PlaneGeometry( width, height );
	bgGeo.translate( posX + width / 2, y, 0 );

	return bgGeo;
}
