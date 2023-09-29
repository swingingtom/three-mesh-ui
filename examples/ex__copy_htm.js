// xfg:title Copy HTM
// xfg:category extend

import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';

import ThreeMeshUI, { FontLibrary } from 'three-mesh-ui';

import Stats from 'three/examples/jsm/libs/stats.module';
import * as HyperThreeMesh from 'three-mesh-ui/examples/hyperthreemesh/HyperThreeMesh';
import MSDFNormalMaterial from 'three-mesh-ui/examples/materials/msdf/MSDFNormalMaterial';
import ROBOTO_ADJUSTMENT from 'three-mesh-ui/examples/assets/fonts/msdf/roboto/adjustment';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let scene, camera, renderer, controls;

const vrStyleSheet = document.createElement('style');
vrStyleSheet.setAttribute('media','three-mesh-ui');
vrStyleSheet.textContent = `

:root{
	font-family: Roboto;
	font-style: normal;
	color: #636363;
	padding: 0.1rem;
}

h1{
	font-size : 0.12rem;
	background-color : rgba(255,0,0,0.9);
	color: #0099FF;
	font-style: italic;
	font-weight: bold;
	/* padding-right: 0.15rem; */
	border-radius: 0rem 1rem 0 0;
	border-color: rgba(255,255,255,0.9);
	border-width: 0.025rem;
	border-bottom-width: 0;
	box-sizing: border-box;
	text-align: left;
}

h1 .title{
	margin: 0.25rem;
	color: green;
}

p {
	background-color : rgba(0,0,0,0.9);
	width: 100%;
	border-radius: 0 0 0.05rem 0.05rem;
	border-width: 0.025rem;
	border-color: rgba(255,255,255,0.9);
	border-top: 0;
}

strong{
	font-weight: bold;
}

em{
	font-style: italic;
}

small{
	font-size: 0.5em;
	margin: 0.1rem;
}

sub{
	font-size: 0.4em;
	vertical-align: sub;
}

sup{
	font-size: 0.4em;
	vertical-align: super;
}

ul{
	padding-left: 0.1rem;
}

ol{
	padding-left: 0.1rem;
}


li{
	margin-left: 0.1rem;
}

ol{
	list-style: decimal;
	background-color: purple;
	width: 2rem;
	height: auto;
}

ol li{
	color: gold;
	font-style: italic;
	border-bottom: 0.01rem solid blue;
}
ul li{
	color: white;
	border-bottom: 0.005rem solid grey;
}

img{
	border-radius : 0.1rem;
}

`;
document.head.appendChild( vrStyleSheet );

FontLibrary.prepare(

	FontLibrary
		.addFontFamily("Roboto")
		.addVariant("normal","normal","./assets/fonts/msdf/roboto/regular.json","./assets/fonts/msdf/roboto/regular.png" )

		// Registering additional variants
		.addVariant("bold", "italic", "./assets/fonts/msdf/roboto/bold-italic.json", "./assets/fonts/msdf/roboto/bold-italic.png" )
		.addVariant("bold", "normal", "./assets/fonts/msdf/roboto/bold.json", "./assets/fonts/msdf/roboto/bold.png" )
		.addVariant("normal", "italic", "./assets/fonts/msdf/roboto/italic.json", "./assets/fonts/msdf/roboto/italic.png" )

// FontLibrary.prepare() returns a Promise, we can therefore add a callback to be executed when all files are loaded
).then( () => {

	// Once font are registered, we can get the font family
	const RobotoFamily = FontLibrary.getFontFamily("Roboto");

	RobotoFamily.getVariant('normal','normal').adjustTypographicGlyphs( ROBOTO_ADJUSTMENT );
	RobotoFamily.getVariant('bold','normal').adjustTypographicGlyphs( ROBOTO_ADJUSTMENT );
	RobotoFamily.getVariant('bold','italic').adjustTypographicGlyphs( ROBOTO_ADJUSTMENT );
	RobotoFamily.getVariant('normal','italic').adjustTypographicGlyphs( ROBOTO_ADJUSTMENT );

	// Add some twist to show not htmlMesh
	RobotoFamily.getVariant('bold','normal').fontMaterial = MSDFNormalMaterial;

	init();

});


let container, stats;
//

function init() {

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x505050);

  camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 0.1, 100);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(WIDTH, HEIGHT);
  renderer.xr.enabled = true;
  document.body.appendChild(VRButton.createButton(renderer));
  document.body.appendChild(renderer.domElement);

	stats = new Stats();
	document.body.appendChild( stats.dom );

  controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 1.6, 0);
  controls.target = new THREE.Vector3(0, 1, -1.8);
  controls.update();

  // ROOM

  const room = new THREE.LineSegments(
    new BoxLineGeometry(6, 6, 6, 10, 10, 10).translate(0, 3, 0),
    new THREE.LineBasicMaterial({ color: 0x808080 })
  );

  scene.add(room);

  // TEXT PANEL

  makeTextPanel();

  //

  renderer.setAnimationLoop(loop);

	window.addEventListener("resize", onWindowResize);
}

//

function makeTextPanel() {

	const htmlElement = document.createElement("div");
// 	htmlElement.innerHTML = `
// 	<header class="bob" data-s="s">
// 	<h1><span class="title">three-mesh-ui</span><sup> v7.1.x</sup><sub>v7.1.x</sub><small>small</small></h1>
// 	<p>Should look <small>similar</small> than <em>window.document</em> but with <strong>Three-mesh-ui</strong></p>
// 	<ul>
// 	<li>Bounlour les nounous.</li>
// 	<li>Comment allez vous?</li>
// </ul>
// <ol>
// 	<li>Bounlour les nounous.</li>
// 	<li>Comment allez vous?</li>
// 	<li>Bounlour les nounous.</li>
// 	<li>Comment allez vous?</li>
// 	<li>Bounlour les nounous.</li>
// 	<li>Comment allez vous?</li>
// 	<li>Bounlour les nounous.</li>
// 	<li>Comment allez vous?</li>
// </ol>
// 	</header>
// 	<section class="sec" data-r="row" _target="blank">
// 	<img src="/assets/spiny_bush_viper.jpg">
//
// </section>
// `
	htmlElement.innerHTML = `
	<p>Should look <sup>similar</sup> than <em>window.document</em> but with <strong>Three-mesh-ui</strong></p>
`

  container = HyperThreeMesh.copy( htmlElement );

	// container.traverse( (o3d) => {
	// 	if( o3d.isBox ){
	// 		new BoxLayoutBehavior(o3d).attach()
	// 	}
	// })

	// new BoxLayoutBehavior(container).attach();

  container.position.set(0, 1, -1.8);

	scene.add(container);

	HyperThreeMesh.loadSheets( "three-mesh-ui", true );

}

//

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function loop() {
  // Don't forget, ThreeMeshUI must be updated manually.
  // This has been introduced in version 3.0.0 in order
  // to improve performance
  ThreeMeshUI.update();
	HyperThreeMesh.update();

  controls.update();
  renderer.render(scene, camera);

	stats.update();
}
