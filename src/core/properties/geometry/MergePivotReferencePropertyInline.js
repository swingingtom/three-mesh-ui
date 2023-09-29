import InheritableProperty from "../InheritableProperty";
import {Vector2} from "three";
import MergePivotReferenceProperty from "./MergePivotReferenceProperty";



export default class MergePivotReferencePropertyInline extends MergePivotReferenceProperty {

	constructor( value = 'self') {

		super('inherit');

	}

	/**
	 *
	 * @param {number|"inherit"} v
	 */
	set value( v ) {


		if ( this._value === v ) return;

		this._value = v;
		this._needsUpdate = true;
	}

	/**
	 *
	 * @override
	 * @return {number}
	 */
	get value() {

		if ( this._value === 'inherit' ) return this._notInheritedValue;

		return this._value;

	}

}
