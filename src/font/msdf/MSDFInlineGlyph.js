import InlineGlyph from '../InlineGlyph';

//JSDoc related imports
/* eslint-disable no-unused-vars */
import MSDFTypographicGlyph from './MSDFTypographicGlyph';
/* eslint-enable no-unused-vars */

/**
 * @extends InlineGlyph
 */
export default class MSDFInlineGlyph extends InlineGlyph{

	/**
	 *
	 * @param {MSDFTypographicGlyph} characterDesc
	 */
	constructor( characterDesc ) {

		super( characterDesc );

	}

	/**
	 *
	 * @returns {MSDFTypographicGlyph}
	 */
	get typographic(){

		return this._typographic;

	}

	/**
	 *
	 * @returns {{left:number, right:number, top:number, bottom:number}|null}
	 */
	get uv() { return this.typographic.uv; }

	/**
	 * @override
	 *
	 * Took distance field into account
	 *
	 * @returns {number}
	 */
	get lineBase() { return this._typographic.font.lineBase * this._fontFactor + this.typographic.font.distanceRange * this._fontFactor }

}
