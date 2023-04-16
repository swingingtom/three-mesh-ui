/* global global */

import UpdateManager from './components/core/UpdateManager.js';
import FontLibrary from './font/FontLibrary.js';
import { ShaderChunkUI } from './renderers/shaders/ShaderChunkUI';
import TypographicFont from './font/TypographicFont';
import TypographicGlyph from './font/TypographicGlyph';
import InlineGlyph from './font/InlineGlyph';
import MSDFFontMaterialUtils from './font/msdf/utils/MSDFFontMaterialUtils';
import * as DefaultValues from './core/DefaultValues';
import MeshUIBaseElement from './core/elements/MeshUIBaseElement';
import BlockElement from './elements/basic/BlockElement';
import TextElement from './elements/basic/TextElement';
import InlineElement from './elements/basic/InlineElement';
import InlineBlockElement from './elements/basic/InlineBlockElement';
import InheritableProperty from './core/properties/InheritableProperty';
import BaseProperty from './core/properties/BaseProperty';
import * as MaterialTransformers from './utils/mediator/transformers/MaterialTransformers';
import Behavior from './utils/Behavior';
import FontVariant from './font/FontVariant';
import BoxElement from './elements/basic/BoxElement';
import StylePropertyWrapper from './elements/html/properties/StylePropertyWrapper';
import StyleComputedPropertyWrapper from './elements/html/properties/StyleComputedPropertyWrapper';
import ChildrenBox from './core/properties/hierarchy/ChildrenBox';
import SubStyleProperty from './core/properties/style-properties/SubStyleProperty';




const update = () => UpdateManager.update();

const ThreeMeshUI = {
	Box: BoxElement,
	Block: BlockElement,
	Text : TextElement,
	Inline: InlineElement,
	InlineBlock : InlineBlockElement,
	// Keyboard : KeyboardElement,
	MeshUIBaseElement,
	FontLibrary,
	update,
	MSDFFontMaterialUtils,
	ShaderChunkUI,
	Behavior,
	FontVariant,
	DefaultValues,
	StylePropertyWrapper,
	StyleComputedPropertyWrapper,
	ChildrenBox,
	SubStyleProperty,
	UpdateManager
};


if ( typeof global !== 'undefined' ) global.ThreeMeshUI = ThreeMeshUI;

export { BlockElement as Block };
export { BoxElement as Box };
export { TextElement as Text };
export { InlineElement as Inline };
export { InlineBlockElement as InlineBlock };
export { FontLibrary };
export { update };
export { ShaderChunkUI };
export { MSDFFontMaterialUtils };
export { TypographicFont }
export { TypographicGlyph }
export { InlineGlyph }
export { MeshUIBaseElement }
export { DefaultValues }
export { InheritableProperty }
export { BaseProperty }
export { MaterialTransformers }
export { Behavior }
export { FontVariant }
export { StylePropertyWrapper}
export { StyleComputedPropertyWrapper }
export { ChildrenBox }
export { SubStyleProperty }
export { UpdateManager }
export default ThreeMeshUI;

console.warn("ThreeMeshUI v7.1.x - Three "+window.__THREE__)




