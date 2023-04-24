import HTMBlockElement from 'three-mesh-ui/examples/hyperthreemesh/core/elements/HTMBlockElement';
import ListStyleProperty from 'three-mesh-ui/examples/hyperthreemesh/core/properties/ListStyleProperty';
import ChildrenList from 'three-mesh-ui/examples/hyperthreemesh/core/properties/hierarchy/ChildrenList';

export default class HTMList extends HTMBlockElement{

	constructor( values = {}, properties = {} ) {

		// let listStyle = values.tagName.toLowerCase() === 'ol' ? 'decimal' : 'disc';
		let listStyle = values.tagName.toLowerCase() === 'ol' ? 'lower-roman' : 'disc';

		console.log( listStyle )

		if( values.listStyle ) {
			listStyle = values.listStyle;
			delete values.listStyle;
		}

		// if( values.margin === undefined ) values.margin = '0.5em';
		if( values.width === undefined) values.width = '100%';

		if( !properties.children ) properties.children = ChildrenList;

		super(values, properties);

		this.appendProperty( "listStyle", new ListStyleProperty() )

		this.listStyleType = listStyle;

	}

	set listStyleType( value ){

		console.log("Set list style "+ value);

		this._listStyle.inline = value;


		console.log( this._listStyle._input);
	}

	get listStyleType(){
		return this._listStyle.inline;
	}

}
