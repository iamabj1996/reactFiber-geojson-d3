import { Canvas } from '@react-three/fiber';
import Globel from './Map/Globel';
import GlobeThreeD from './Map/GlobeThreeD';
import { useState } from 'react';
import { FormCheck } from 'react-bootstrap';

import { InfinitySpin } from 'react-loader-spinner';

function App() {
	const [geoJsonTexture, setGeoJsonTexture] = useState(null);
	const [worldView, setWorldView] = useState(true);
	const [nightMode, setNightMode] = useState(false);
	const [clouds, setClouds] = useState(false);

	const handleTextureReady = (texture) => {
		setGeoJsonTexture(texture);
	};

	return (
		<>
			{!geoJsonTexture && (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center', // This centers vertically
						minHeight: '100vh', // Ensures the div takes up the full viewport height
					}}
				>
					<InfinitySpin color='#32fbe2' width='350' />
					<h3>Loading...</h3>
				</div>
			)}
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
						setWorldView(!worldView);
					}}
					label='Countries'
				/>
				<FormCheck
					type='checkbox'
					checked={!worldView}
					onClick={(e) => {
						setWorldView(!worldView);
					}}
					label='Continent'
				/>
			</div>
			<div style={{ position: 'fixed', top: '90%', left: '70%' }}>
				<FormCheck
					type='checkbox'
					checked={nightMode}
					onClick={(e) => {
						setNightMode(!nightMode);
					}}
					label='NightMode'
				/>
				<FormCheck
					type='checkbox'
					checked={clouds}
					onClick={(e) => {
						setClouds(!clouds);
					}}
					label='Add Clouds'
				/>
			</div>
		</>
	);
}

export default App;
