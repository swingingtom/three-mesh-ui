import { SubStyleProperty } from 'three-mesh-ui';


export default class ListStyleProperty extends SubStyleProperty {

	constructor() {

		super( 'listStyle', 'inherit', true );

	}

	isValidValue( value ) {

		return _validValues.indexOf( value ) !== -1;

	}

	update( element, out ) {

		console.log( "ListStyle update "+ element.constructor.name, element._children._uis );
		if( !this._allowsInherit ) {

			this._inheritedInput = this.getInheritedInput( element );

		}

		this.computeOutputValue( element );

		console.log("    ", this._value)

		// rebuild same properties on children 'inheritance'
		for ( const childUIElement of element._children._uis ) {

			const property = childUIElement[`_${this._id}`];

			if( !property ) {

				console.log( "Ignore " + childUIElement.constructor.name, "empty ", property )
				continue;
			}

			const target = property._input ? property._input : property._value;

			console.log( childUIElement.constructor.name, target );

			if( target === 'inherit' ) {

				console.log("    update child --- listStyle "+ childUIElement.constructor.name );
				childUIElement[`_${this._id}`]._needsUpdate = true;
			}

		}

		this.output( out );

	}

	getDefaultValue() {

		return 'square';

	}

}

const _validValues = ['square','disc','circle', 'decimal', 'lower-roman'];


