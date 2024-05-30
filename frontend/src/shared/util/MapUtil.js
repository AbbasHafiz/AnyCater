import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map as OlMap, View, Feature } from 'ol';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM as OSMSource, Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';

const MapUtil = ({ onUpdateLocation }) => {
  const mapRef = useRef();

  useEffect(() => {
    const mapElement = mapRef.current;
    const map = new OlMap({
      target: mapElement,
      layers: [
        new TileLayer({
          source: new OSMSource(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    // Create a vector layer for the pointer
    const pointerLayer = new VectorLayer({
      source: new VectorSource(),
    });
    map.addLayer(pointerLayer);

    // Get the user's current location using Geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const center = fromLonLat([longitude, latitude]);
        map.getView().setCenter(center);
        map.getView().setZoom(12);

        // Update the location with the user's current coordinates
        onUpdateLocation(latitude, longitude, 'Current Location');

        // Add a marker for the current location
        const marker = new Feature({
          geometry: new Point(center),
        });
        pointerLayer.getSource().addFeature(marker);
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );

    // Add click event listener to the map
    map.on('click', async (event) => {
      const coordinates = event.coordinate;
      const [longitude, latitude] = toLonLat(coordinates);
      let address = '';

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        address = data.display_name;
      } catch (error) {
        console.error('Error fetching address:', error);
      }

      onUpdateLocation(latitude, longitude, address);
    });

    return () => {
      map.dispose();
    };
  }, [onUpdateLocation]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default MapUtil;
