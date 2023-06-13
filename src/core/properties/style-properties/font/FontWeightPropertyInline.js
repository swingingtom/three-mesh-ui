import FontWeightProperty from './FontWeightProperty';
import { uniformizeFontWeight } from '../../../../font/utils/FontUtils';

export default class FontWeightPropertyInline extends FontWeightProperty {

	constructor( def ) {

		super( def );

	}

	computeOutputValue( element ) {

		this._value = uniformizeFontWeight( this.getInheritedInput( element )	);

		element._font._needsUpdate = true;

	}

}
