import BaseProperty from './BaseProperty';


//JSDoc related imports
/* eslint-disable no-unused-vars */
import Inline from '../elements/glyphs/Inline';
/* eslint-enable no-unused-vars */

export default class InlinesProperty extends BaseProperty{

	constructor() {

		super( "inlines", null, false );

		/**
		 *
		 * @type {Array.<Inline>}
		 * @private
		 */
		this._value = null;

	}

	process( element ) {

		this._value = element._glyphs._value.map( ( glyphBox ) => glyphBox.asInlineGlyph() );

		if( this._value.length ) {

			// First gets left side
			this._value[0].paddingLeft = element._padding._value.w;
			this._value[0].marginLeft = element._margin._value.w;

			// Last gets right side
			const lastIndex = this._value.length - 1;
			this._value[lastIndex].paddingRight = element._padding._value.y;
			this._value[lastIndex].marginRight = element._margin._value.y;

		}


		element._verticalAlign._needsProcess = true;
		element._fontSize._needsProcess = true;
		element._lineBreak._needsProcess = true;
		element._fontKerning._needsProcess = true;
		element._layouter._needsProcess = true;

	}

	/**
	 *
	 * @return {Array.<Inline>}
	 */
	get value() { return this._value; }

}
