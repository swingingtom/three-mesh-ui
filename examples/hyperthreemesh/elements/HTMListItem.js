import HTMTextElement from 'three-mesh-ui/examples/hyperthreemesh/core/elements/HTMTextElement';
import HTMInlineElement from 'three-mesh-ui/examples/hyperthreemesh/core/elements/HTMInlineElement';
import ListStyleProperty from 'three-mesh-ui/examples/hyperthreemesh/core/properties/ListStyleProperty';
import ListStylePropertyInlineBlock from 'three-mesh-ui/examples/hyperthreemesh/core/properties/ListStylePropertyInlineBlock';
import HTMInlineBlockElement from 'three-mesh-ui/examples/hyperthreemesh/core/elements/HTMInlineBlockElement';

export default class HTMListItem extends HTMTextElement{

	constructor( values = {} ) {


		let textContent = "";
		if( values.textContent ){
			textContent = values.textContent;
			delete values.textContent;
		}

		super(values);

		this.appendProperty( "listStyle", new ListStyleProperty() );

		// @TODO: A morpheable inline-block to inline-text would be better than this
		this._listStyleElementBlock = new HTMInlineBlockElement({
			width:'50%',
			height:'50%',
			margin: '0.5em',
			tagName:"-list-style-block",
		});

		this._listStyleElementText = new HTMInlineElement({
			tagName:"-list-style-text",
			margin: '0.5em',
			textContent : ""
		});

		this._listStyleElementBlock._textCounterPart = this._listStyleElementText;
		this._listStyleElementBlock.appendProperty( "listStyle", new ListStylePropertyInlineBlock() );

		this.add( this._listStyleElementBlock );
		this.add( this._listStyleElementText );

		if( textContent !== "")	this.textContent = textContent;

	}

	/*********************************************************************************************************************
	 * PROVIDES AN API OVER `textContent` for listStyle
	 ********************************************************************************************************************/

	set textContent ( value ) {

		console.error( "Setting text content", value );

		for ( let i = this.children.length - 1 ; i >= 0; i-- ) {
			const child = this.children[ i ];
			if( child.isUI && child !== this._listStyleElementBlock && child !== this._listStyleElementText ) {

				console.log( "HtmlLIstItem remove", child)
				this.remove( child );
				child.clear();

			}

		}

		if( value ) {

			this.add( new HTMInlineElement({tagName:'anonymous-span',textContent:value}));

		}

	}

	remove( object ) {

		console.error("remove")

		return super.remove( object );
	}

	get textContent ( ) {
		return super.textContent;
	}

	set listStyleType( value ){
		this._listStyle.inline = value;
	}

	get listStyleType(){
		return this._listStyle.inline;
	}

}
