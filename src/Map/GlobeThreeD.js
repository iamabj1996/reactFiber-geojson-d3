import React, { useEffect, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import {
	Color,
	Points,
	PointsMaterial,
	BufferGeometry,
	Float32BufferAttribute,
	ShaderMaterial,
	SphereGeometry,
	Mesh,
	MathUtils,
} from 'three';
import * as THREE from 'three';

// Define your cloud vertex shader
const cloudVertexShader = `
  varying vec3 vPosition;

  void main() {
    vPosition = position;
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
  }
`;

// Define your cloud fragment shader
const cloudFragmentShader = `
  uniform float time;
  varying vec3 vPosition;

  void main() {
    // Create cloud-like noise based on position and time
    float cloudNoise = fract(sin(dot(vPosition, vec3(12.9898, 78.233, 45.543))) * 43758.5453);

    // Adjust cloud transparency based on noise
    float alpha = cloudNoise * 0.2; // You can adjust this value for opacity

    // Cloud color (white)
    vec3 cloudColor = vec3(1.0);

    // Combine cloud color with background color based on alpha
    vec3 finalColor = mix(cloudColor, vec3(0.0), alpha);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const GlobeThreeD = ({ geoJsonTexture, clouds }) => {
	const orbitControlRef = useRef();
	const sphereMesh = useRef();
	const cloudsMesh = useRef(); // Ref for clouds mesh
	const { camera, scene } = useThree();

	useEffect(() => {
		camera.position.set(0, -2, 11);
		camera.rotation.y = Math.PI / 4;
		camera.lookAt(sphereMesh.current.position);
	}, [camera]);

	useFrame((data) => {
		// Rotate the sphere
		// sphereMesh.current.rotation.y += data.clock.elapsedTime * 0.0002;
	});

	useEffect(() => {
		orbitControlRef.current.minPolarAngle = Math.PI * 0.1;
		orbitControlRef.current.maxPolarAngle = Math.PI * 0.9;
		orbitControlRef.current.minDistance = 6;
		orbitControlRef.current.maxDistance = 12;
		orbitControlRef.current.camera = sphereMesh.current.position;

		const starCount = 2000;
		const starPositions = [];
		const starGeometry = new BufferGeometry();

		for (let i = 0; i < starCount; i++) {
			const x = (Math.random() - 0.5) * 20;
			const y = (Math.random() - 0.5) * 20;
			const z = (Math.random() - 0.5) * 20;
			starPositions.push(x, y, z);
		}

		starGeometry.setAttribute(
			'position',
			new Float32BufferAttribute(starPositions, 3)
		);

		const starColors = [];
		const starMaterial = new PointsMaterial({ size: 0.02 });

		for (let i = 0; i < starCount; i++) {
			const color = new Color(Math.random(), Math.random(), Math.random());
			starColors.push(color.r, color.g, color.b);
		}

		starGeometry.setAttribute(
			'color',
			new Float32BufferAttribute(starColors, 3)
		);

		starMaterial.vertexColors = true;
		const stars = new Points(starGeometry, starMaterial);
		scene.add(stars);

		scene.background = new Color(0x000000);

		// Add or remove clouds based on the 'clouds' prop
		if (clouds) {
			const clouds = createClouds();
			cloudsMesh.current = clouds;
			scene.add(clouds);
		} else {
			if (cloudsMesh.current) {
				scene.remove(cloudsMesh.current);
			}
		}
	}, [scene, clouds]);

	// Function to create the clouds
	const createClouds = () => {
		const cloudGeometry = new SphereGeometry(4, 32, 32);

		// Cloud shader material
		const cloudsMaterial = new ShaderMaterial({
			vertexShader: cloudVertexShader,
			fragmentShader: cloudFragmentShader,
			transparent: true,
			blending: THREE.AdditiveBlending,
		});

		const clouds = new Mesh(cloudGeometry, cloudsMaterial);
		clouds.position.copy(sphereMesh.current.position);

		return clouds;
	};

	return (
		<>
			<OrbitControls ref={orbitControlRef} enableZoom={true} />
			<ambientLight />
			<mesh position={[0, 1, 0]} ref={sphereMesh}>
				<sphereGeometry args={[4, 32, 32]} />
				<meshMatcapMaterial args={[2, 32, 32]} map={geoJsonTexture} />
			</mesh>
		</>
	);
};

export default GlobeThreeD;
