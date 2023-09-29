import TypographicFont from '../TypographicFont';

export default class MSDFTypographicFont extends TypographicFont{

	/**
	 *
	 * @param {import('./MSDFFontVariant').MSDFJson} json
	 */
	constructor( json ) {

		super();

		// base description
		this._size = json.info.size;
		this._lineHeight = json.common.lineHeight;
		this._lineBase = json.common.base;

		this._name = json.info.face;

		// MSDF
		this._textureWidth = json.common.scaleW;
		this._textureHeight = json.common.scaleH;

		this._charset = json.chars.map( char => char.char ).join("");

		this._distanceRange = json.distanceField.distanceRange;

		// currently set by MSDFFontVariant
		// this._xHeight = ...;
		this._capHeight = (this._lineHeight/2) - (this._lineHeight-this._lineBase);

	}

	/**
	 *
	 * @return {number}
	 */
	get distanceRange() { return this._distanceRange; }

	/**
	 *
	 * @returns {number}
	 */
	get textureWidth() { return this._textureWidth; }

	/**
	 *
	 * @returns {number}
	 */
	get textureHeight() { return this._textureHeight; }

}
