'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const HospitalMap = React.memo(function HospitalMap({
  hospitals,
  onHospitalClick,
  highlightedHospitalId,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef({});
  const [mapInitialized, setMapInitialized] = useState(false);

  const initializeMap = useCallback(() => {
    if (mapContainer.current && !map.current && hospitals.length > 0) {
      const firstHospital = hospitals[0];
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: firstHospital.location.coordinates,
        zoom: 12,
      });

      map.current.on('load', () => {
        setMapInitialized(true);
      });
    }
  }, [hospitals]);

  const updateMarkers = useCallback(() => {
    if (mapInitialized && map.current && hospitals.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();

      hospitals.forEach((hospital) => {
        if (!hospital.location || !hospital.location.coordinates) {
          console.warn(`Hospital missing location data:`, hospital);
          return;
        }

        const [lng, lat] = hospital.location.coordinates;
        bounds.extend([lng, lat]);

        if (!markersRef.current[hospital._id]) {
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.backgroundColor =
            hospital._id === highlightedHospitalId ? '#ff0000' : '#3FB1CE';
          el.style.width = '25px';
          el.style.height = '25px';
          el.style.borderRadius = '50%';

          const marker = new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<h3>${hospital.name}</h3>`
              )
            )
            .addTo(map.current);

          marker.getElement().addEventListener('click', () => {
            onHospitalClick(hospital._id);
          });

          markersRef.current[hospital._id] = marker;
        } else {
          markersRef.current[hospital._id].getElement().style.backgroundColor =
            hospital._id === highlightedHospitalId ? '#ff0000' : '#3FB1CE';
        }
      });

      // Remove markers for hospitals that no longer exist
      Object.keys(markersRef.current).forEach((id) => {
        if (!hospitals.find((h) => h._id === id)) {
          markersRef.current[id].remove();
          delete markersRef.current[id];
        }
      });

      // Fit map to show all markers
      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
      }
    }
  }, [mapInitialized, hospitals, onHospitalClick, highlightedHospitalId]);

  const highlightHospital = useCallback(() => {
    if (mapInitialized && highlightedHospitalId) {
      const highlightedHospital = hospitals.find(
        (h) => h._id === highlightedHospitalId
      );
      if (highlightedHospital && highlightedHospital.location) {
        map.current.flyTo({
          center: highlightedHospital.location.coordinates,
          zoom: 15,
          speed: 0.8,
          curve: 1,
          easing(t) {
            return t;
          },
        });

        const marker = markersRef.current[highlightedHospitalId];
        if (marker) {
          marker.togglePopup();
        }
      }
    }
  }, [mapInitialized, highlightedHospitalId, hospitals]);

  useEffect(() => {
    initializeMap();
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initializeMap]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  useEffect(() => {
    highlightHospital();
  }, [highlightHospital]);

  return (
    <div
      ref={mapContainer}
      style={{ height: '100%', width: '100%' }}
      className='map-container'
    />
  );
});

export default HospitalMap;
