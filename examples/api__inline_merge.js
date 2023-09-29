// xfg:title InlineMerge
// xfg:category learn

import * as THREE from 'three';
import {Color, DoubleSide, Vector2} from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';

import ThreeMeshUI, { FontLibrary } from 'three-mesh-ui';
import ROBOTO_ADJUSTMENT from 'three-mesh-ui/examples/assets/fonts/msdf/roboto/adjustment';
import MSDFNormalMaterial from 'three-mesh-ui/examples/materials/msdf/MSDFNormalMaterial';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let scene, camera, renderer, controls, animatable = [];

window.addEventListener( 'load', preloadFonts );
window.addEventListener( 'resize', onWindowResize );

function preloadFonts() {

	FontLibrary.prepare(

		FontLibrary
			.addFontFamily("Roboto")
				.addVariant("normal", "normal", "./assets/fonts/msdf/roboto/regular.json", "./assets/fonts/msdf/roboto/regular.png" )
				.addVariant("bold", "italic", "./assets/fonts/msdf/roboto/bold-italic.json", "./assets/fonts/msdf/roboto/bold-italic.png" )
				.addVariant("bold", "normal", "./assets/fonts/msdf/roboto/bold.json", "./assets/fonts/msdf/roboto/bold.png" )
				.addVariant("normal", "italic", "./assets/fonts/msdf/roboto/italic.json", "./assets/fonts/msdf/roboto/italic.png" )

	).then( init );

}

//

function init() {


	const FF = FontLibrary.getFontFamily("Roboto");
	FF.getVariant('bold','normal').adjustTypographicGlyphs( ROBOTO_ADJUSTMENT );
	FF.getVariant('bold','italic').adjustTypographicGlyphs( ROBOTO_ADJUSTMENT );
	FF.getVariant('normal','italic').adjustTypographicGlyphs( ROBOTO_ADJUSTMENT );
	FF.getVariant('normal','normal').adjustTypographicGlyphs( ROBOTO_ADJUSTMENT );

	// Build three

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x505050 );

	camera = new THREE.PerspectiveCamera( 60, WIDTH / HEIGHT, 0.1, 100 );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( WIDTH, HEIGHT );
	renderer.xr.enabled = true;
	document.body.appendChild( VRButton.createButton( renderer ) );
	document.body.appendChild( renderer.domElement );

	controls = new OrbitControls( camera, renderer.domElement );
	camera.position.set( 0, 1.6, 0 );
	controls.target = new THREE.Vector3( 0, 1, -1.8 );
	controls.update();

	// ROOM

	const room = new THREE.LineSegments(
		new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ).translate( 0, 3, 0 ),
		new THREE.LineBasicMaterial( { color: 0x808080 } )
	);

	scene.add( room );

	// TEXT PANEL

	makeTextPanel();

	//

	ThreeMeshUI.update();

	renderer.setAnimationLoop( loop );

}

//

function makeTextPanel() {

	const container = new ThreeMeshUI.Block( {
		width: 2,
		height: 0.3,
		padding: 0.05,
		justifyContent: 'center',
		textAlign: 'left',
		fontFamily: "Roboto", // As we preloaded fontFamily("Roboto") with variants, we can directly reference the font name
		backgroundOpacity: 0,
	} );

	container.position.set( 0, 1, -1.8 );
	container.rotation.x = -0.25;
	scene.add( container );

	//

	const infoBox = new ThreeMeshUI.Text( {
		width: 2,
		height: 0.175,
		margin: 0.01,
		padding: 0.025,
		textAlign: 'center',
	} );

	infoBox.add( new ThreeMeshUI.Inline( {
		textContent: '.inlineMerge ',
		fontWeight: 'bold',
	} ) );

	infoBox.add( new ThreeMeshUI.Inline( {
		textContent: ' defines how to merge inlines.\n',
		fontWeight: 'bold',
	} ) );

	infoBox.add( new ThreeMeshUI.Inline( {
		textContent: 'All glyphs, glyphs on the same line, or even no merge at all.\n',
		letterSpacing: 0.05
	} ) );

	container.add( infoBox );

	// let children = makeKernedContainer( 'none', "ThreeMeshUI v7.x", 0.2 );
	let children = makeKernedContainer( 'none', "T", 0.2 );
	addAnimatable( children );
	container.add( children );
	children = makeKernedContainer( 'line', "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 0.042 );
	addAnimatable( children );
	container.add( children );
	children = makeKernedContainer( 'all', "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 0.042 )
	addAnimatable( children );
	container.add( children );



}

function addAnimatable( block ){

	const text = block.children[2];
	const previous = [];
	text.addAfterUpdate( () => {

		if( previous.length > 1 ){
			for (let i = 0; i < previous.length; i++) {
				const prev = previous[i];
				const index = animatable.indexOf( prev );
				if( index > -1 ){
					animatable.splice( index, 1);
				}
			}
		}

		const length = text.children[1].children.length;
		for (let i = 0; i < length; i++) {
			const child = text.children[1].children[i];
			if( child.isInlineMesh ){
				previous.push( child );
				animatable.push( child );

				child.rotation.x = (i / length - 1 ) * 360;
			}
		}

	});
}

function makeKernedContainer( inlineMerge, textContent, fontSize ) {


	const container = new ThreeMeshUI.Block( {
		width: 1.8,
		padding: 0.05,
		flexDirection: "row",
		justifyContent: 'center',
		alignItems : 'center',
		textAlign: 'left',
		fontFamily: "Roboto",
		backgroundOpacity: 0.5
	} );

	const title = new ThreeMeshUI.Text( {
		width : 'auto',
		margin: 0.01,
		padding: 0.025,
		justifyContent: 'center',
		backgroundColor: new Color( 0x333333 ),
		backgroundOpacity : 0.7,
		textAlign: 'left',
		textContent : `.set({inlineMerge: "${inlineMerge}"})`
	} );

	container.add( title );

	const textBox = new ThreeMeshUI.Text( {
		margin: 0.01,
		padding: 0.02,
		justifyContent: 'center',
		backgroundOpacity: 0,
		fontSize,
		textContent,
		inlineMerge,
		fontSide: DoubleSide,
		fontWeight: 'bold',
		textDecoration : inlineMerge === 'none' ? 'underline': 'none',
		mergePivot : new Vector2(0,0)
	} );

	container.add( textBox );

	return container;


}

// handles resizing the renderer when the viewport is resized

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function loop() {

	// Don't forget, ThreeMeshUI must be updated manually.
	// This has been introduced in version 3.0.0 in order
	// to improve performance
	// ThreeMeshUI.update();

	for (let i = 0; i < animatable.length; i++) {
		const animatableElement = animatable[i];
		animatableElement.rotation.x += 0.01;
	}


	controls.update();
	renderer.render( scene, camera );

}
