import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';

import ThreeMeshUI from '../src/three-mesh-ui.js';

import FontJSON from './assets/Roboto-msdf.json';
import FontImage from './assets/Roboto-msdf.png';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let scene, camera, renderer, controls;

window.addEventListener( 'load', init );
window.addEventListener( 'resize', onWindowResize );

//

function init() {

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

	// TEXT PANEL

	makeTextPanel();

	//

	renderer.setAnimationLoop( loop );

}

//

function makeTextPanel() {

	const container = new ThreeMeshUI.Block( {
		width: 0.25,
		height: 0.5,
		padding: 0.02,
		fontSize: 0.055,
		justifyContent: 'center',
		alignContent: 'left',
		fontFamily: FontJSON,
		fontTexture: FontImage,
	} );

	container.position.set( 0, 1, -1.8 );
	container.rotation.x = -0.55;
	scene.add( container );

	//


	container.add(
		new ThreeMeshUI.Text( {
			content: 'This library supports line-break-friendly-characters, As well as multi-font-size lines with consistent vertical spacing.',

		} )
	);

	container.onAfterUpdate = function(){

		if( container.lines.length > 1 ){

			// add the width of all lines
			let newWidth = container.lines.reduce( (accu, line) => { return accu + line.width }, 0);

			// also add one space per line ( to handle additional space when both lines would be end-to-end )
			// Ideally instead of container.getFontSize(), the space character size should be used
			// Also, this can cause issue when container is really thin, because each char will be a line, then add space
			//newWidth += (container.lines.length-1) * container.getFontSize();
			// or
			// use a constant compensator
			newWidth += container.getFontSize() * 3;

			// also apply its padding
			newWidth += ( container.padding * 2 || 0 );


			setTimeout( ()=>{

				// then update the container size
				container.set({width:newWidth});

				// the set timeout is useless, just to show the 2 passes

			}, 1000 )


		}
	}


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
	ThreeMeshUI.update();

	controls.update();
	renderer.render( scene, camera );

}
