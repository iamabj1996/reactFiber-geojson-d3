import { Canvas } from '@react-three/fiber';
import Globel from './Map/Globel';
import GlobeThreeD from './Map/GlobeThreeD';
import { useEffect, useState } from 'react';
import { Form, FormCheck } from 'react-bootstrap';

function App() {
	const [geoJsonTexture, setGeoJsonTexture] = useState(null);
	const [worldView, setWorldView] = useState(true);
	const [continentView, setContinentView] = useState(false);
	const [nightMode, setNightMode] = useState(false);
	const [clouds, setClouds] = useState(false);

	const handleTextureReady = (texture) => {
		setGeoJsonTexture(texture);
	};

	return (
		<>
			<Canvas>
				<GlobeThreeD geoJsonTexture={geoJsonTexture} clouds={clouds} />
			</Canvas>
			<Globel
				onTextureReady={handleTextureReady}
				worldView={worldView}
				nightMode={nightMode}
			/>
			<div style={{ position: 'fixed', top: '5%', left: '5%' }}>
				<FormCheck
					type='checkbox'
					checked={worldView}
					onClick={(e) => {
						console.log('click');
						setWorldView(!worldView);
						setContinentView(false);
					}}
					label='World'
				/>
				<FormCheck
					type='checkbox'
					checked={continentView}
					onClick={(e) => {
						console.log('click');
						setContinentView(!continentView);
						setWorldView(false);
					}}
					label='Continent'
				/>
			</div>
			<div style={{ position: 'fixed', top: '90%', left: '70%' }}>
				<FormCheck
					type='checkbox'
					checked={nightMode}
					onClick={(e) => {
						console.log('click');
						setNightMode(!nightMode);
					}}
					label='NightMode'
				/>
				<FormCheck
					type='checkbox'
					checked={clouds}
					onClick={(e) => {
						console.log('click');
						setClouds(!clouds);
					}}
					label='Add Clouds'
				/>
			</div>
		</>
	);
}

export default App;
