import { Canvas } from '@react-three/fiber';
import Globel from './Map/Globel';
import GlobeThreeD from './Map/GlobeThreeD';
import { useState } from 'react';

function App() {
	const [geoJsonTexture, setGeoJsonTexture] = useState(null);

	const handleTextureReady = (texture) => {
		setGeoJsonTexture(texture);
	};

	console.log('geoJsonTexture23', geoJsonTexture);

	return (
		<>
			<Canvas>
				<GlobeThreeD geoJsonTexture={geoJsonTexture} />
			</Canvas>
			<Globel onTextureReady={handleTextureReady} />
		</>
	);
}

export default App;
