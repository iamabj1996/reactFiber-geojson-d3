import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3-geo';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

// Assuming you have imported your GeoJSON data as WORLD_JSON
// Import your GeoJSON data here if not already done
import { worldJson } from '../WorldGeoJson';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Return texture created from canvas choropleth
const Globel = ({ onTextureReady }) => {
	const [geoJsonTexture, setGeoJsonTexture] = useState();
	// Create a canvas element and save a reference
	const CANVAS_WIDTH = 2000; // Define your canvas width
	const CANVAS_HEIGHT = 1000; // Define your canvas height
	const PROJECTION_AR = 2; // Define your projection aspect ratio

	// const COLOR_SCALE = d3.scaleSequential(d3.interpolateViridis); // Define your color scale

	// Initialize the D3 geo projection for the canvas
	const PROJECTION = d3
		.geoEquirectangular()
		.translate([CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2])
		.scale(
			Math.min(CANVAS_WIDTH / PROJECTION_AR / Math.PI, CANVAS_HEIGHT / Math.PI)
		);

	// Assuming you have your data ready, you can define DATA as needed
	const canvasRef = useRef();
	const threeCanvasRef = useRef();
	const orbitControlsRef = useRef();

	console.log('threeCanvasRef', threeCanvasRef.current);
	console.log('orbitControlsRef', orbitControlsRef.current);

	useEffect(() => {
		// Get 2D context of the canvas
		const context = canvasRef.current.getContext('2d');

		// Create a geo path generator
		const path = d3.geoPath().projection(PROJECTION).context(context);

		// Draw background
		context.fillStyle = '#0000A5 ';
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// Draw features from GeoJSON
		context.strokeStyle = '#555';
		context.lineWidth = 1;

		worldJson.features.forEach((d) => {
			console.log('d', d);
			context.fillStyle = 'white';
			context.beginPath();
			path(d);
			context.fill();
			context.stroke();

			const centroid = path.centroid(d);
			const countryName = d.properties.name;

			context.font = '4px Arial';
			context.fillStyle = 'black';
			context.textAlign = 'center';
			context.fillText(countryName, centroid[0], centroid[1]);
			context.imageSmoothingEnabled = true;
		});

		// Generate a texture from the canvas
		const texture = new THREE.CanvasTexture(canvasRef.current);
		texture.needsUpdate = true;
		setGeoJsonTexture(texture);
		onTextureReady(texture);
	}, []);

	console.log('texture', geoJsonTexture);

	// Return the canvas element
	return (
		<>
			<canvas
				ref={canvasRef}
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
				style={{ display: 'none' }}
			/>
		</>
	);
};

export default Globel;
