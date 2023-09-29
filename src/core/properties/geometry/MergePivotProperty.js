import InheritableProperty from "../InheritableProperty";
import {Vector2} from "three";


const _defaultValue = new Vector2(0,0);

export default class MergePivotProperty extends InheritableProperty {

	constructor( value = _defaultValue) {

		super( 'mergePivot', value, false );

		this.isValid = _isValid;

	}

	update(element, out) {
		super.update(element, out);

		element._renderer._needsRender = true;
	}

}

/**
 *
 * @param {any} value
 * @return {boolean}
 * @private
 */
function _isValid( value ) {

	return value.isVector2 || value === 'inherit';

}
