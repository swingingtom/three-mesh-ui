//xfg:title Basic setup default

import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';

import ThreeMeshUI from 'three-mesh-ui';
import { Vector4 } from 'three';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let scene, camera, renderer, controls;


window.addEventListener('load', step1BuildThreeJSElements );

// define three-mesh-ui defaults
ThreeMeshUI.DefaultValues.set({
	backgroundColor: 0x00ff99,
	backgroundOpacity: 1,
	borderColor: 0xffffff,
	borderOpacity: 1,
	borderWidth: 0.02,
	borderRadius: 0.0025,
	color: 0xff0000
});

ThreeMeshUI.DefaultValues.set({
	padding: 0.1,
	borderRadius: 0.02,
	borderColor: 0x99ff00,
	borderWidth: new Vector4(0.01,0.01,0.08,0.01)
}, 'block');

ThreeMeshUI.DefaultValues.set({
	color: 0xff9900
}, 'inline')

/***********************************************************************************************************************
 * THREE-MESH-UI - BASIC SETUP
 * ---------------------------
 *
 * This tutorial is made of 3 steps, split by functions:
 *    - step1BuildThreeJSElements()
 *    - step2BuildThreeMeshUIElements()
 *    - step3AnimationLoop()
 *
 * Be sure to read all of their comments, in the proper order before going for another tutorial.
 **********************************************************************************************************************/


// three-mesh-ui requires working threejs setup
// We usually build the threejs stuff prior three-mesh-ui
function step1BuildThreeJSElements() {

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x505050 );

	camera = new THREE.PerspectiveCamera( 60, WIDTH / HEIGHT, 0.1, 100 );

	renderer = new THREE.WebGLRenderer( {
		antialias: true
	} );
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


	// Now that we have the threejs stuff up and running, we can build our three-mesh-ui stuff
	// Let's read that function
	step2BuildThreeMeshUIElements();

	// three-mesh-ui requires to be updated prior each threejs render, let's go see what is in step3AnimationLoop()
	renderer.setAnimationLoop( step3AnimationLoop );


	window.addEventListener( 'resize', onWindowResize );
}

//
function step2BuildThreeMeshUIElements() {

	// If we are going to display ThreeMeshUI Text elements
	// It is important to know that a Text MUST have a Block as parent
	// Using three-mesh-ui, we would usually have one or more rootBlock elements
	const rootBlock = new ThreeMeshUI.Text( {

		name: 'rootBlock',
		// A Block must define its "box-sizing" properties
		width: 1.3,
		height: 'auto', // the text will define the output height
		boxSizing: 'border-box',

		// A Block can define its "layout" properties
		justifyContent: 'center',
		textAlign: 'left',

		// A Block can also define "text" properties that will propagate to any of its Text children
		fontSize: 0.055,
		padding: 0.015,

		fontFamily: './assets/fonts/msdf/roboto/regular.json',
		fontTexture: './assets/fonts/msdf/roboto/regular.png',
		// @Note: setting fontFamily
		// This looks very easy, but this isn't the best way for handling fonts
		// However it is perfect for a first glance on how to get started with three-mesh-ui
		// Be sure you next step will be `Getting started - Preload fonts`

	} );


	// three-mesh-ui root elements must be added on threejs display stack
	// In the scene, or in another Object3D of our choice
	scene.add( rootBlock );

	// three-mesh-ui Block are Object3D agreemented with three-mesh-ui capabilities
	// so you can use any existing Object3D methods and properties
	rootBlock.position.set( 0, 1, -1.8 );
	rootBlock.rotation.x = -0.55;


	rootBlock.set({textContent: 'Hello world'});
	rootBlock.textContent = "Hello bingo;"

	// rootBlock.add(
	//
	//
	// 	new ThreeMeshUI.Inline( {
	// 		// three-mesh-ui Text should defined their content to display
	// 		textContent: 'This library supports line-break-friendly-characters,',
	//
	// 		// if a Text is going to use the exact same Text properties as defined in its parent
	// 		// there is no need to set those properties again
	// 		// fontSize: 0.055,
	// 		// fontFamily: './assets/fonts/msdf/roboto/regular.json',
	// 		// fontTexture: './assets/fonts/msdf/roboto/regular.png',
	//
	// 	} ),
	//
	// 	new ThreeMeshUI.Inline( {
	// 		textContent: ' As well as multi-font-size lines with consistent vertical',
	//
	// 		// If a Text must have different Text properties as defined in its parent
	// 		// We just have to define it on a specific Text
	// 		fontSize: 0.08,
	// 		fontFamily: './assets/fonts/msdf/roboto/italic.json',
	// 		fontTexture: './assets/fonts/msdf/roboto/italic.png',
	//
	// 		color: 0xffffff
	// 	} ),
	//
	// 	new ThreeMeshUI.Inline( {
	// 		color: 'inherit',
	// 		textContent: ' spacing!',
	// 		fontSize: 0.08,
	// 		fontFamily: './assets/fonts/msdf/roboto/bold-italic.json',
	// 		fontTexture: './assets/fonts/msdf/roboto/bold-italic.png',
	// 	} )
	//
	// );


	setInterval( ()=>{
		rootBlock.set({color:Math.random()*0xffffff})
	}, 2500 )

}

// In order to see things, we need to render them, usually on each frame
function step3AnimationLoop() {

	// Don't forget, ThreeMeshUI must be updated manually.
	// This has been introduced in version 3.0.0 in order
	// to improve performance
	ThreeMeshUI.update();

	controls.update();
	renderer.render( scene, camera );

}


// handles resizing the renderer when the viewport is resized
// common threejs stuff
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}

