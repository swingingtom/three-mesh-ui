import SubStyleProperty from '../SubStyleProperty';

export default class FontSizeProperty extends SubStyleProperty {

	constructor() {

		super( 'fontSize', 'inherit', true );

		this._fontRelative = false;
	}

	/**
	 *
	 * @param {MeshUIBaseElement} element
	 * @param {Object.<string,any> } out
	 */
	update( element, out ) {

		this._inheritedInput = this.getInheritedInput( element );
		this._value = _parseValue( this._inheritedInput, element );

		this.computeOutputValue( element );

		// rebuild same properties on children 'inheritance'
		for ( const childUIElement of element._children._uis ) {

			const property = childUIElement[`_${this._id}`];

			if( !property ) continue;

			const target = property._input ? property._input : property._value;

			if( target === 'inherit' || property._fontRelative ) childUIElement[`_${this._id}`]._needsUpdate = true;

		}

		this.output( out );

	}

	/* eslint-disable no-unused-vars */
	computeOutputValue( element ) {}
	/* eslint-enable no-unused-vars */

}

function _parseValue( v, element ){

	element._fontSize._fontRelative = false;

	if( !isNaN(v) ) return v;

	if( v.endsWith('em') ) {

		element._fontSize._fontRelative = true;

		return parseFloat( v.replace(/[^0-9.]+/,"") ) * element._parent._value._fontSize.getInheritedInput(element._parent._value);

	}
}


