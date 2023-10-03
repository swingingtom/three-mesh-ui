import RendererPropertyBox from './RendererPropertyBox';
import Frame from '../../../frame/Frame';

export default class RendererPropertyText extends RendererPropertyBox{

	constructor() {

		super( 'renderer' );

		this._needsUpdate = false;

	}


	render( element ) {

		if( !element._backgroundMesh ) {

			element.setBackgroundMesh( new Frame(element) );

		}

		for ( const inlineElement of element._children._inlines ) {

			inlineElement._renderer.render( inlineElement );
			inlineElement._renderer._needsRender = false;

		}

		element.performAfterUpdate();

	}

}
