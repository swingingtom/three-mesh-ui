import { Vector3 } from 'three';
import BaseProperty from './BaseProperty';

export default class BoundsInlines extends BaseProperty {

	constructor() {

		super();

		/**
		 *
		 * @type {Vector3}
		 * @internal
		 */
		this._size = new Vector3( 1, 1, 1 );

		/**
		 *
		 * @type {number}
		 * @internal
		 */
		this._offsetWidth = 1;

		/**
		 *
		 * @type {number}
		 * @internal
		 */
		this._offsetHeight = 1;

	}

	update( element, out ) {

		console.log("Bounds inline updated")

		super.update( element, out );
	}

	/**
	 *
	 * @param {Object.<string,any>} out
	 */
	output( out ) {

		out[ 'size' ] = this._size;

	}

}
