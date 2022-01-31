
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';

import ThreeMeshUI from '../src/three-mesh-ui.js';

import FontJSON from './assets/Roboto-msdf.json';
import FontImage from './assets/Roboto-msdf.png';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import {Object3D, PointLight, PointLightHelper} from "three";
import FontStandardMaterial from "./materials/FontStandardMaterial";
import FontPhysicalMaterial from "./materials/FontTransmissionMaterial";


const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let scene, camera, renderer, controls, stats;
let light, lightContainer, lightHelper;
let outerContainer, innerContainer;
let text;

window.addEventListener('load', init );
window.addEventListener('resize', onWindowResize );

//

function init() {

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x505050 );

	camera = new THREE.PerspectiveCamera( 60, WIDTH / HEIGHT, 0.1, 100 );

	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( WIDTH, HEIGHT );
	renderer.xr.enabled = true;
	document.body.appendChild(VRButton.createButton(renderer));
	document.body.appendChild( renderer.domElement );

	stats = new Stats();
	document.body.appendChild( stats.dom );

	controls = new OrbitControls( camera, renderer.domElement );
	camera.position.set( 0, 1.6, 0 );
	controls.target = new THREE.Vector3( 0, 1, -1.8 );
	controls.update();

	// ROOM

	const room = new THREE.LineSegments(
		new BoxLineGeometry( 6, 6, 6, 32, 32, 32 ).translate( 0, 3, 0 ),
		new THREE.LineBasicMaterial( { color: 0x808080 } )
	);

	scene.add( room );


    lightContainer = new Object3D();
    lightContainer.rotation.z = 0.45;
    lightContainer.position.set(0,1,-1.8);

    light = new PointLight(0xffFF99,3);
    light.position.set(1,0,0);
    lightContainer.add(light)

    lightHelper = new PointLightHelper(light,0.15,0xff0000);
    scene.add(lightHelper);

    scene.add(lightContainer);


	// TEXT PANEL

	makeTextPanel();

	//

	renderer.setAnimationLoop( loop );

};

//

function makeTextPanel() {

	outerContainer = new ThreeMeshUI.Block({
        width: 1.6,
        height: 0.4,
		padding: 0.05,
		backgroundColor: new THREE.Color( 0x121212 ),
		backgroundOpacity: 0.5,
        interLine:-0.1,
		justifyContent: 'center',
		alignContent: 'center',
		fontColor: new THREE.Color( 0xFF9900 ),
		fontFamily: FontJSON,
		fontTexture: FontImage,
        fontSize: 0.25,
	});

	outerContainer.position.set( 0, 1, -1.8 );
	outerContainer.rotation.x = -0.55;
	scene.add( outerContainer );


    let text = new ThreeMeshUI.Text({content:"ThreeMeshUI"});
    let newFontMat = new FontStandardMaterial({/* wireframe:true*/});
    /*newFontMat = new FontPhysicalMaterial({color: 0xffffff,
        transmission: 1,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 1.5,
        thickness: 0.01,
        specularIntensity: 1,
        specularColor: 0xffffff,
        envMapIntensity: 1,
        lightIntensity: 1,
        exposure: 1});*/
    newFontMat.name = "customMat";

    text.fontMaterial = newFontMat;
    console.log(text.fontMaterial);
    // text.fontMaterial

    text.onAfterUpdate = ()=>{
        console.log(text.fontMaterial.name);
        if( text.children.length > 0){
            for ( let i = 0; i < text.children.length; i++ ) {
                const child = text.children[i];
                console.log(child.material);
            }
        }
    }

    setInterval( ()=>{

        let color = new THREE.Color(Math.random(),Math.random(),Math.random());
        text.set({fontColor: color, fontOpacity:Math.random()});

    },2500);
    //
    //
    // // change segments
    // setInterval( ()=>{
    //     text.set({segments: Math.ceil(Math.random()*15 ) });
    //
    // },500);

    outerContainer.add( text );

};


// handles resizing the renderer when the viewport is resized

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
};



//

function loop() {

    lightContainer.rotation.y += 1/30;

	// Don't forget, ThreeMeshUI must be updated manually.
	// This has been introduced in version 3.0.0 in order
	// to improve performance
	ThreeMeshUI.update();

	controls.update();
	renderer.render( scene, camera );
	// stats.update()
};
