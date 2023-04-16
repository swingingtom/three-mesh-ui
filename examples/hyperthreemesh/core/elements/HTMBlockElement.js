import HTMBoxElement from 'three-mesh-ui/examples/hyperthreemesh/core/elements/HTMBoxElement';
import { Block } from 'three-mesh-ui';

/**
 * @extends {MeshUIBaseElement}
 */
export default class HTMBlockElement extends HTMBoxElement {

	/**
	 *
	 * @param {Object.<string,any>} [values={}]
	 * @param {Object.<string,any>} [properties={}]
	 */
	constructor( values= {}, properties={}) {

		Block.definePropertiesValues( properties, values );
		super( properties, values );
		Block.init( this );

	}

	/* eslint-disable no-unused-vars */
	/**
	 * A Block Element can only contains box elements
	 * @override
	 * @param {...Object3D} object
	 * @return {this}
	 */
	add( object ) {
		/* eslint-enable no-unused-vars */

		/**
		 *
		 * @type {Array.<Object3D>}
		 */
		const validChildren = [];

		for ( let i = 0; i < arguments.length; i++ ) {

			const argument = arguments[ i ];

			if ( !argument.isUI || argument.isBox ) {

				validChildren.push( argument );

			} else {

				console.warn( 'Block element can only contain Box elements.', argument );

			}

		}

		return super.add( ...validChildren );

	}

}
