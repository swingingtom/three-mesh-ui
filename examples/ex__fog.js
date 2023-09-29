// xfg:title Fog
// xfg:category Demo

import * as THREE from 'three';
import { DirectionalLight, DoubleSide, Fog, LinearSRGBColorSpace, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry, SpotLight, TextureLoader } from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';

import ThreeMeshUI, { FontLibrary } from 'three-mesh-ui';
import MSDFStandardMaterial from './materials/msdf/MSDFStandardMaterial';
import MSDFDepthMaterial from '../src/font/msdf/materials/MSDFDepthMaterial';
import MSDFNormalMaterial from './materials/msdf/MSDFNormalMaterial';
import MSDFPhysicalMaterial from './materials/msdf/MSDFPhysicalMaterial';
import BoundsUVBehavior from './behaviors/geometries/BoundsUVBehavior';


let texture;

FontLibrary.prepare(

		FontLibrary

			.addFontFamily("swt").addVariant('normal','normal', './assets/fonts/msdf/swt/regular.json', './assets/fonts/msdf/swt/regular.png')

).then( () => {

	const FluxFamily = FontLibrary.getFontFamily("swt");

	// FluxFamily.getVariant('normal','normal').fontMaterial = MSDFStandardMaterial;

	texture = new TextureLoader().load( './assets/chalice.png', ()=>{
		texture.needsUpdate = true;

	})

	step1BuildThreeJSElements();




} );



//
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let scene, camera, renderer, controls;
let floor, spot, chalice;

// three-mesh-ui requires working threejs setup
// We usually build the threejs stuff prior three-mesh-ui
function step1BuildThreeJSElements() {

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );

	// scene.fog = new Fog(0xffffff, 0.1, 10);
	scene.fog = new Fog(0xffffff, 0.1, 10);

	camera = new THREE.PerspectiveCamera( 60, WIDTH / HEIGHT, 0.1, 100 );

	renderer = new THREE.WebGLRenderer( {
		antialias: true,
	} );
	renderer.outputColorSpace = LinearSRGBColorSpace;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( WIDTH, HEIGHT );
	renderer.xr.enabled = true;

	renderer.shadowMap.enabled = true;
	// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.shadowMap.type = THREE.VSMShadowMap;

	document.body.appendChild( VRButton.createButton( renderer ) );
	document.body.appendChild( renderer.domElement );

	controls = new OrbitControls( camera, renderer.domElement );
	camera.position.set( 0, 1.6, 5 );
	controls.target = new THREE.Vector3( 0, 1, -1.8 );
	controls.update();

	floor = new Mesh(
		new PlaneGeometry(20,20,5,5),
		new MeshStandardMaterial({color:0xffffff})
		// new MeshBasicMaterial({color:0x99ffff})
	);
	floor.receiveShadow = true;
	floor.rotation.x = -Math.PI/2;

	scene.add(floor);

	// spot = new DirectionalLight(0xffffff,3, 10, Math.PI/3, 1.0, 1.25 );
	spot = new DirectionalLight(0xffffff,3 );
	spot.position.set(0, 20, 15);
	// spot.position.set(0, 5, 0);
	spot.castShadow = true;

	//Set up shadow properties for the light
	// spot.shadow.mapSize.width = 1024; // default
	// spot.shadow.mapSize.height = 1024; // default
	// spot.shadow.camera.near = 0.5; // default
	// spot.shadow.camera.far = 500; // default

	spot.shadow.mapSize.width = 512
	spot.shadow.mapSize.height = 512
	spot.shadow.camera.near = 0.5
	spot.shadow.camera.far = 50
	spot.shadow.camera.left = -20
	spot.shadow.camera.right = 20
	spot.shadow.camera.top = 20
	spot.shadow.camera.bottom = -20
	spot.shadow.radius = 5
	spot.shadow.blurSamples = 25

	scene.add( spot )



	// chalice = new Mesh(
	// 	new PlaneGeometry(4,4,5,5),
	// 	new MeshStandardMaterial({color:0xffffff,map:texture, transparent: false, alphaTest: 0.25, side:DoubleSide})
	// 	// new MeshBasicMaterial({color:0x99ffff})
	// );
	// chalice.castShadow = true;
	// chalice.receiveShadow = true;
	// scene.add( chalice )
	// chalice.rotation.x = - Math.PI/2;
	// // chalice.position.y = 0.25;
	// chalice.position.y = 0.12;

	// Now that we have the threejs stuff up and running, we can build our three-mesh-ui stuff
	// Let's read that function
	step2BuildThreeMeshUIElements();

	// three-mesh-ui requires to be updated prior each threejs render, let's go see what is in step3AnimationLoop()
	renderer.setAnimationLoop( step3AnimationLoop );


	window.addEventListener( 'resize', onWindowResize );
}

//
function step2BuildThreeMeshUIElements() {


	const text = new ThreeMeshUI.Text( {
		width: 'auto',
		// height: 4,
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 2,
		// As we have prepare our fonts we can now use them
		fontFamily: "swt",
		// color: "red",
		color: 0x000000,
		fontCastShadow:true,
		fontSide:DoubleSide,
		fog: true
	} )

	text.add(
		new ThreeMeshUI.Inline({
			textContent: 'three-mesh-ui',
		}),
		new ThreeMeshUI.Inline({
			textContent: ' v7.1',
			verticalAlign: 'super',
			fontSize: '0.5em'
		}),

	)
	// text.position.y = 1.35;
	text.position.y = 1;
	scene.add( text )



	// text.fontMaterial = new MSDFStandardMaterial({fog:true, /*map: texture*/});
	// text.fontMaterial = new MSDFStandardMaterial({fog:true, /*map: texture*/});

	// new BoundsUVBehavior( text, text).attach();
	text.fontMaterial = new MeshStandardMaterial({fog:true});
	// text.fontCustomDepthMaterial = new MSDFDepthMaterial({});

}

//

function step3AnimationLoop() {

	// Don't forget, ThreeMeshUI must be updated manually.
	// This has been introduced in version 3.0.0 in order
	// to improve performance
	ThreeMeshUI.update();

	controls.update();
	renderer.render( scene, camera );

}

// handles resizing the renderer when the viewport is resized
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}
