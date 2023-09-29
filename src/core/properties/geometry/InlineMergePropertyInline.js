import InlineMergeProperty from "./InlineMergeProperty";
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils';
import {Mesh} from "three";

export default class InlineMergePropertyInline extends InlineMergeProperty {

	constructor() {

		super( 'inherit' );

		this._value = 'inherit';
		this._notInheritedValue = undefined;

		/**
		 *
		 * @return Mesh|Mesh[]
		 */
		this.apply = applyMergeAll;

	}


	/* eslint-disable no-unused-vars */
	update( element, out ) { 	/* eslint-enable no-unused-vars */

		this._notInheritedValue = this._value;
		if ( this._notInheritedValue === 'inherit' || this._notInheritedValue === undefined ) {

			this._notInheritedValue = this.getInheritedInput( element );

		}

		switch (this._notInheritedValue) {

			case 0:
			case "all":
				this.apply = applyMergeAll;
				break;

			case 1:
			case "line":
				this.apply = applyMergeLine;
				break;

			case 2:
			case "none":
				this.apply = applyMergeNone;
				break
		}

		element._layouter._needsUpdate = true;

	}

	/**
	 *
	 * @param {number|"inherit"} v
	 */
	set value( v ) {


		if ( this._value === v ) return;

		this._value = v;
		this._needsUpdate = true;
	}

	/**
	 *
	 * @override
	 * @return {number}
	 */
	get value() {

		if ( this._value === 'inherit' ) return this._notInheritedValue;

		return this._value;

	}

}


function applyMergeAll( geometries, element ){
	const mesh = new Mesh( mergeGeometries( geometries ), element.fontMaterial );
	mesh.isInlineMesh = true;
	return mesh;
}

/**
 *
 * @param geometries
 * @param element
 * @return {Mesh<*,*>|Mesh<*, *>[]}
 */
function applyMergeLine( geometries, element ){
	const lines = [];
	const linesInfo = [];
	const inlines = element._inlines._value;
    const pivot = element._mergePivot.value;
    const pivotRef = element._pivotReference.value;

	for ( let i = 0; i < inlines.length; i++ ) {

		const inline = inlines[i];
		const lineIndex = inline.lineIndex;
		if( !lines[lineIndex] ) {
			lines[lineIndex] = [];
			linesInfo[lineIndex] = inline.line;
		}

		let tx = 0;
		let ty = -linesInfo[lineIndex].y + inlines[lineIndex].lineBase / 2;

        if( pivotRef === 'self'){
            // apply pivot 'self'
            tx += pivot.x * linesInfo[lineIndex].width;
            ty += pivot.y * linesInfo[lineIndex].lineBase;
        }else{
            tx += pivot.x * linesInfo[lineIndex].width;
            ty += pivot.y * linesInfo[lineIndex].lineBase;
        }


		lines[lineIndex].push( geometries[i].translate( tx, ty, 0 ) );

	}


	return lines.map( (geometries, lineIndex) => {
		const mesh = new Mesh( mergeGeometries(geometries), element.fontMaterial );
		mesh.isInlineMesh = true;

        let px = 0;
        let py = linesInfo[lineIndex].y - inlines[lineIndex].lineBase / 2;

        if( pivotRef === 'self'){
            // apply pivot 'self'
            px -= pivot.x * linesInfo[lineIndex].width;
            py -= pivot.y * linesInfo[lineIndex].lineBase;
        }else{
            px -= pivot.x * linesInfo[lineIndex].width;
            py -= pivot.y * linesInfo[lineIndex].lineBase;
        }

		console.log(px,py)
		mesh.position.x = px;
		mesh.position.y = py;




		return mesh;
	});
}

function applyMergeNone( geometries, element ){
	const inlines = element._inlines._value;
	console.log(element._mergePivot);
	const pivot = element._mergePivot.value;
	const pivotRef = element._pivotReference.value;

	return geometries.map( (geometry, index) => {

		// set on center of glyph
		let tx = -inlines[index].offsetX - inlines[index].width/2;
		let ty = -inlines[index].offsetY + inlines[index].height/2;

		if( pivotRef === 'self'){
			// apply pivot 'self'
			tx += pivot.x * inlines[index].width;
			ty += pivot.y * inlines[index].height;
		}else{
			tx += pivot.x * inlines[index].width;
			ty += pivot.y * inlines[index].height;
		}

		geometry.translate(tx, ty ,0 )

		const mesh = new Mesh( geometry, element.fontMaterial)
		mesh.isInlineMesh = true;

		let px = inlines[index].offsetX + inlines[index].width/2;
		let py = inlines[index].offsetY - inlines[index].height/2;

		if( pivotRef === 'self'){
			px -= inlines[index].width * pivot.x;
			py -= inlines[index].height * pivot.y;
		}else{
			px -= inlines[index].width * pivot.x;
			py -= inlines[index].height * pivot.y;
		}

		mesh.position.x = px;
		mesh.position.y = py;

		return mesh;
	} )
}
