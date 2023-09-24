import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3-geo';
import * as THREE from 'three';
import { worldJson } from '../WorldGeoJson';
import { continentGeoJson } from '../ContinentGeoJson';

const Globel = ({ onTextureReady, worldView, nightMode }) => {
	const [geoJsonTexture, setGeoJsonTexture] = useState();
	const CANVAS_WIDTH = 2000;
	const CANVAS_HEIGHT = 1000;
	const PROJECTION_AR = 2;
	const PROJECTION = d3
		.geoEquirectangular()
		.translate([CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2])
		.scale(
			Math.min(CANVAS_WIDTH / PROJECTION_AR / Math.PI, CANVAS_HEIGHT / Math.PI)
		);

	// Assuming you have your data ready, you can define DATA as needed
	const canvasRef = useRef();

	useEffect(() => {
		// Get 2D context of the canvas
		const context = canvasRef.current.getContext('2d');

		// Create a geo path generator
		const path = d3.geoPath().projection(PROJECTION).context(context);

		// Draw background
		context.fillStyle = nightMode ? 'black' : '#0000A5 ';
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		if (worldView) {
			// Draw features from GeoJSON
			context.strokeStyle = '#555';
			context.lineWidth = 1;

			worldJson.features.forEach((d) => {
				context.fillStyle = 'white';
				context.beginPath();
				path(d);
				context.fill();
				context.stroke();

				const centroid = path.centroid(d);
				const countryName = d.properties.name;

				context.font = '7px Arial';
				context.fillStyle = 'black';
				context.textAlign = 'center';
				context.fillText(countryName, centroid[0], centroid[1]);
				context.imageSmoothingEnabled = true;
			});
		}

		if (!worldView) {
			// Draw features from GeoJSON
			context.strokeStyle = '#555';
			context.lineWidth = 1;

			continentGeoJson.features.forEach((d) => {
				context.fillStyle = 'white';
				context.beginPath();
				path(d);
				context.fill();
				context.stroke();

				const centroid = path.centroid(d);
				const countryName = d.properties.CONTINENT;

				context.font = '7px Arial';
				context.fillStyle = 'black';
				context.textAlign = 'center';
				context.fillText(countryName, centroid[0], centroid[1]);
				context.imageSmoothingEnabled = true;
			});
		}

		// Generate a texture from the canvas
		const texture = new THREE.CanvasTexture(canvasRef.current);
		texture.needsUpdate = true;
		setGeoJsonTexture(texture);
		onTextureReady(texture);
	}, [worldView, nightMode]);

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
