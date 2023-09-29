// xfg:title Pivot
// xfg:category learn
// xfg:type explore

import ThreeMeshUI from 'three-mesh-ui';
let rootBlock, text, animatable = [];

function example() {

	// A rootBlock element
	rootBlock = new ThreeMeshUI.Text( {
				padding: 0.05,

		// layout properties
		justifyContent: 'center',
		textAlign: 'center',

		// backgroundOpacity: 0.15,
		// backgroundColor: 0x000000,

		// text properties
		fontSize: 0.2,
		fontSide: DoubleSide,
		// fontFamily: "Courier Prime",
		fontWeight : "bold",
		textContent : "THREEMESHUI v7.x",
		inlineMerge: 'none',
		fontMaterial : new MSDFNormalMaterial()
	} );

	rootBlock.position.set( 0, 1, -1.8 );
	// rootBlock.rotation.x = -0.55;
	scene.add( rootBlock );


	rootBlock.addAfterUpdate( ()=>{

		animatable = [];
		rootBlock.traverse( object => {
			if( object.isInlineMesh ){
				animatable.push( object );

				object.rotation.x = (animatable.length-1) * params.stepX;
				object.rotation.y = (animatable.length-1) * params.stepY;
			}
		})

	});

}




































/***********************************************************************************************************************
 * Above this comment, you could find the contextual setup of this example.
 * Not really related to the example itself : Creating three renderer, scene, lights, etc...
 **********************************************************************************************************************/

import {
	exampleAddResizer,
	exampleAddUpdate,
	exampleRender,
	exampleThreeSetup
} from 'three-mesh-ui/examples/_setup/ThreeSetup';
import { exampleFontPreloadRoboto } from 'three-mesh-ui/examples/_setup/RobotoFont';
import { exampleFontPreloadCourier } from 'three-mesh-ui/examples/_setup/CourierFont';

import exampleGUI from 'three-mesh-ui/examples/_setup/gui/exampleGUI';
import { DefaultValues, Inline } from 'three-mesh-ui';
import {Color, DoubleSide, LinearSRGBColorSpace, Vector2} from 'three';
import { exampleCameraPerspective, exampleCameraPerspectiveResize } from './_setup/CameraPerspective';
import { exampleRoomVR } from './_setup/RoomVR';
import RichTextContentProperty from './properties/text/RichTextContentProperty';
import MSDFNormalMaterial from "three-mesh-ui/examples/materials/msdf/MSDFNormalMaterial";
/* eslint-disable no-unused-vars */

// building three setup
const { camera } = exampleCameraPerspective();
exampleAddResizer( exampleCameraPerspectiveResize );

camera.position.set(0, 1.6, 0);
// controls.target = new THREE.Vector3(0, 1, -1.8);

const { scene, renderer } = exampleThreeSetup( camera );
renderer.outputColorSpace = LinearSRGBColorSpace;
// renderer.colorSpace = LinearSRGBColorSpace;
exampleAddUpdate( ()=>{
	for (let i = 0; i < animatable.length; i++) {
		const animatableElement = animatable[i];

		animatableElement.rotation.x += params.speedX;
		animatableElement.rotation.y += params.speedY;
	}
});

exampleAddResizer( exampleRender );

exampleRoomVR( scene );

// preload fonts and run example() after
exampleFontPreloadCourier( () => {
	const defaultFontFamily = exampleFontPreloadRoboto( () => { example(); additionalUI(); exampleRender(); boxSizingUI(); });
	DefaultValues.set({fontFamily:defaultFontFamily});
})

let infoBlock, border, params = {};
function additionalUI(){

	infoBlock = new ThreeMeshUI.Block({
		name: 'info-block',
		width: 'auto',
		padding: 0.05,
		height: 'auto',
		flexDirection: 'row',
		justifyContent: 'start',
		alignItems: 'center',
		backgroundColor: 0x000000,
		borderRadius : 0.025,
	});

	infoBlock.backgroundMaterial.depthWrite = false;

	infoBlock.position.z = -2
	infoBlock.position.y = 0.4;

	infoBlock.position.set(0, 0.6, -1.5);
	infoBlock.rotation.x = -0.35;

	scene.add( infoBlock );

	border = new ThreeMeshUI.Block({
		name: 'border-container',
		height: 'auto',
		flexDirection: 'column',
		justifyContent: "start",
		fontOpacity: 1
	})

	const borderTitle = new ThreeMeshUI.Text({name:'border-title', textContent: `Slice`, fontWeight: '700', fontSize: 0.08, lineHeight:1.5, width: 'auto',margin:0.05});
	const borderContent = new ThreeMeshUI.Text({
		name: 'border-content',
		textAlign: "left",
		lineHeight: 0.8,
	}).add(
		new Inline({
			textContent: 'A slice definition '
		}),
		new Inline({
			textContent: 'MUST ',
			fontWeight: '700',
			fontStyle: 'italic'
		}),
		new Inline({
			textContent: 'be provided during instanciation. '
		}),
		new Inline({
			textContent: '\n\nbackgroundSize MUST ',
			fontWeight: '700',
			fontStyle: 'italic'
		}),
		new Inline({
			textContent: 'be set to '
		}),
		new Inline({
			textContent: '"stretch".',
			fontWeight: '700',
		}),
		new Inline({
			textContent: '\n\nborderRadius, borderWidth ',
			fontWeight: '700',
			fontStyle: 'italic'
		}),
		new Inline({
			textContent: 'may produce unexpected results.'
		}),

		new Inline({
			textContent: '\n\nDepending on the output size, texture',
		}),
		new Inline({
			textContent: '.minFilter ',
			fontWeight: '700',
			fontStyle: 'italic'
		}),
		new Inline({
			textContent: 'can be handy.',
		}),

	);

	border.add( borderTitle, borderContent )


	infoBlock.add( borderTitle,border);

}

function boxSizingUI() {

	const gui = exampleGUI();

	params = {
		infoBox: true,
		merge:'none',
		pivotX:0,
		pivotY:0,
		pivotReference: 'self',
		stepX:0.12,
		stepY:0,
		speedX: 0.05,
		speedY: 0,
		text: 'THREEMESHUI v7.x',
	}

	gui.add( params, 'infoBox' ).onChange( ib => {
		infoBlock.visible = ib;

		exampleRender();

	});


	const geometryUI = gui.addFolder( 'geometry settings' );
	geometryUI.add( params, 'merge', {'all':0,'line':1,'none':2} ).onChange( v => {
		rootBlock.set({inlineMerge:v});
	})

	geometryUI.add( params, 'pivotReference', {'self':'self','parent':'parent'} ).onChange( v => {
		rootBlock.set({pivotReference:v});
	})

	geometryUI.add( params, 'pivotX', -5,5, 0.1 ).onChange( v => {
		const pivot = new Vector2(params.pivotX,params.pivotY);
		rootBlock.set({mergePivot:pivot});
	})

	geometryUI.add( params, 'pivotY', -5,5, 0.1 ).onChange( v => {
		const pivot = new Vector2(params.pivotX,params.pivotY);
		rootBlock.set({mergePivot:pivot});
	})


	const animationUI = gui.addFolder( 'animation settings' );

	animationUI.add( params, 'stepX', 0,1, 0.01 ).onChange( v => {
		rootBlock._renderer._needsRender = true;
	})

	animationUI.add( params, 'stepY', 0,1, 0.01 ).onChange( v => {
        rootBlock._renderer._needsRender = true;
	})

	animationUI.add( params, 'speedX', 0,1, 0.01 );
	animationUI.add( params, 'speedY', 0,1, 0.01 );


	// @TODO : Append controller
	const textController = geometryUI.add( params, 'text' ).onChange( t => {
		rootBlock.textContent = t;
	})

	textController.domElement.style.flexDirection = 'column';
	textController.domElement.style.alignItems = 'start';

	textController.$input.style.height = '120px';
	textController.$input.style.border = '1px solid #969696';
	textController.$input.style.textAlign = 'left';
	textController.$input.style.display = 'none';

	const textArea = document.createElement('textarea');
	textArea.style.width = '100%';
	textArea.style.height = '80px';
	textArea.style.resize = 'vertical';
	textArea.value = rootBlock.textContent;
	textController.$widget.appendChild( textArea );
	console.log( textController );

	textArea.addEventListener('input',()=>{
		rootBlock.textContent = textArea.value;
		exampleRender();
	})


}
