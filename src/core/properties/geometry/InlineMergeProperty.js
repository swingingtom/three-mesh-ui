import InheritableProperty from "../InheritableProperty";

export default class InlineMergeProperty extends InheritableProperty {

	constructor( value = 0) {

		super( 'inlineMerge', value, false );

		this.isValid = _isValid;

	}

}

const AVAILABLE_VALUES = [ 0, "all", 1, "line", 2, "none" ];

/**
 *
 * @param {any} value
 * @return {boolean}
 * @private
 */
function _isValid( value ) {

	if( AVAILABLE_VALUES.indexOf( value) === -1 ){

		console.warn(`InlineMergeProperty value '${value}' is not valid. Abort`);
		return false;

	}

	return true;

}
