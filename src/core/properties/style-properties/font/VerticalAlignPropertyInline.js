import VerticalAlignProperty from './VerticalAlignProperty';


export default class VerticalAlignPropertyInline extends VerticalAlignProperty {

	constructor() {

		super();

		// configure
		this._allowsInherit = false;
		this._needsUpdate = false;

	}


	/* eslint-disable no-unused-vars */ computeOutputValue( element ) { /* eslint-enable no-unused-vars */

		this._value = this._inheritedInput;

		element._renderer._needsRender = true;

	}

}
