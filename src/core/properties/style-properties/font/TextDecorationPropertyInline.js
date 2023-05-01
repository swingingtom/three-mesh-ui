import TextDecorationProperty from './TextDecorationProperty';


export default class TextDecorationPropertyInline extends TextDecorationProperty {

	constructor( defaultValue ) {

		super( defaultValue );

		// configure
		this._allowsInherit = false;
		this._needsUpdate = false;

	}


	/* eslint-disable no-unused-vars */ computeOutputValue( element ) { /* eslint-enable no-unused-vars */

		this._value = this._inheritedInput;

		if( this._value === 'none' ) {

			if( element._decoMesh ) {

				element.remove( element._decoMesh );
				element._decoMesh = null;

			}

		} else {

			element._renderer._needsRender = true;

		}

	}

}
