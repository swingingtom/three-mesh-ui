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


	const decorations = value.split(' ');
	for ( let i = 0; i < decorations.length; i++ ) {

		const requestedDecoration = decorations[ i ];
		if( AVAILABLE_VALUES.indexOf( requestedDecoration ) === -1 ) {

			console.warn( `(.style) text-decoration value '${requestedDecoration}' is not valid. Aborted` );
			return false;

		}
	}


	return true;

}
