import React, { Fragment, useState, useEffect } from 'react';
import { GeoJsonGeometry } from 'three-geojson-geometry';
import { worldJson } from '../WorldGeoJson';

export default function ThreeGeo() {
	const [isLoading, setIsLoading] = useState(true);
	const [geoJson, setGeoJson] = useState(worldJson);

	return (
		<Fragment>
			{!isLoading ? (
				<Fragment>
					{geoJson.features.map(({ geometry }, index) => {
						return (
							<lineSegments
								key={index}
								geometry={new GeoJsonGeometry(geometry, 4)}
							>
								<lineBasicMaterial color='#464646' />
							</lineSegments>
						);
					})}
				</Fragment>
			) : null}
		</Fragment>
	);
}
