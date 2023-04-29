import StyleVector4Property from '../StyleVector4Property';
export default class PaddingProperty extends StyleVector4Property {

	constructor( defaultValue ) {

		super('padding', defaultValue )

	}

	computeOutputValue( element ) {

		super.computeOutputValue( element );

		element._bounds._needsUpdate = true;
		element._bounds._needsRender = true;
		element._layouter._needsProcess = true;
		element._renderer._needsRender = true;

		const p = element._parent._value;
		if( p ) {

			p._bounds._needsUpdate = true;
			p._flexDirection._needsUpdate = true;

		}

	}

}
