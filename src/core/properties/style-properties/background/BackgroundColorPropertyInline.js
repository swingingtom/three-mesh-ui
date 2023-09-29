import StyleColorProperty from '../StyleColorProperty';

//JSDoc related imports
/* eslint-disable no-unused-vars */
/* eslint-enable no-unused-vars */

export default class BackgroundColorPropertyInline extends StyleColorProperty {

	constructor( defaultValue ) {

		super( 'backgroundColor', defaultValue, false );

		this._allowsInherit = false;

		this._input = defaultValue;


	}

	/* eslint-disable no-unused-vars */
	/**
	 *
	 * @param {MeshUIBaseElement} element
	 */
	computeOutputValue( element ) { /* eslint-enable no-unused-vars */

		// @TODO : Changes multiple mesh visibility

		const visibility = !( this._input === 'none' || this._input === 'transparent' );
		if ( element._backgroundMesh ) {

			if ( !visibility ) {

				element._backgroundMesh.visible = false;
				element._backgroundNone = true;

			}

		} else if ( visibility ) {

			element._backgroundNone = false;

		}


		if ( this._input === 'inherit' ) {

			this._value.set( this.getInheritedInput( element ) );

		} else if ( visibility ) {

			this._value.set( this._input );

		}


	}

}


