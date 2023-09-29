import InheritableProperty from "../InheritableProperty";
import {Vector2} from "three";
import MergePivotProperty from "./MergePivotProperty";


const _defaultValue = new Vector2(0.5,0.5);

export default class MergePivotInline extends MergePivotProperty {

	constructor( ) {

		super( 'inherit' );

		this._value = 'inherit'

	}

	/* eslint-disable no-unused-vars */
	update( element, out ) { 	/* eslint-enable no-unused-vars */

		this._notInheritedValue = this._value;

		if ( this._notInheritedValue === 'inherit' ) {

			this._notInheritedValue = this.getInheritedInput( element );

		}

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
