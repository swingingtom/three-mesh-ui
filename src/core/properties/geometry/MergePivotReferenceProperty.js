import InheritableProperty from "../InheritableProperty";
import {Vector2} from "three";



export default class MergePivotReferenceProperty extends InheritableProperty {

	constructor( value = 'self') {

		super( 'mergePivot', value, false );

		this.isValid = _isValid;

	}

}

const AVAILABLE_VALUES = [ 'self', 'parent' ];

/**
 *
 * @param {any} value
 * @return {boolean}
 * @private
 */
function _isValid( value ) {

	if( AVAILABLE_VALUES.indexOf( value) === -1 ){

		console.warn(`InlineMergeReferenceProperty value '${value}' is not valid. Abort`);
		return false;

	}

	return true;

}
