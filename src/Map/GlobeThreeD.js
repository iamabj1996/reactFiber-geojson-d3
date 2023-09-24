import { OrbitControls, TransformControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import {
	Vector3,
	Points,
	PointsMaterial,
	BufferGeometry,
	Float32BufferAttribute,
	Color,
} from 'three';

const GlobeThreeD = ({ geoJsonTexture }) => {
	const orbitControlRef = useRef();
	const sphereMesh = useRef();
	const { camera, scene } = useThree();

	// Set the initial camera position and look at point
	useEffect(() => {
		camera.position.set(0, -2, 12);
		camera.rotation.y = Math.PI / 4;
		camera.lookAt(sphereMesh.current.position);
	}, [camera]);

	useFrame((data) => {
		// sphereMesh.current.rotation.y += data.clock.elapsedTime * 0.0002;
		console.log('camera', camera);
	});

	useEffect(() => {
		orbitControlRef.current.minPolarAngle = Math.PI * 0.1;
		orbitControlRef.current.maxPolarAngle = Math.PI * 0.9;
		orbitControlRef.current.minDistance = 6; // Minimum zoom-in distance
		orbitControlRef.current.maxDistance = 12; // Maximum zoom-out distance (4 times initial distance)
		orbitControlRef.current.camera = sphereMesh.current.position;
		console.log('orbitControlRef', orbitControlRef.current);

		const starCount = 1000;
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

		// Create random colors for the stars
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

		starMaterial.vertexColors = true; // Enable vertex colors
		const stars = new Points(starGeometry, starMaterial);
		scene.add(stars);

		scene.background = new Color(0x000000);
	}, [scene]);

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
