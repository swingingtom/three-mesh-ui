import SubStyleProperty from '../SubStyleProperty';


export default class TextDecorationProperty extends SubStyleProperty {

	constructor( defaultValue ) {

		super( 'textDecoration', defaultValue , true );

		this.isValidValue = _isValid;

	}

}

/**
 *
 * @type {Array.<string>}
 */
const AVAILABLE_VALUES = ['none', 'inherit', 'underline', 'overline', 'line-through'];

/**
 *
 * @param {any} value
 * @return {boolean}
 * @private
 */
const _isValid = function ( value ) {

	if( AVAILABLE_VALUES.indexOf( value ) === -1 ) {

		console.warn( `(.style) text-decoration value '${value}' is not valid. Aborted` );
		return false;

	}

	return true;

}
