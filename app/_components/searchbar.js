'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ChevronDown, Loader2 } from 'lucide-react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useSearchHospitalsMutation } from '../api/useSearchHospitalsMutation';

const osunLGAs = [
  'Atakumosa East',
  'Atakumosa West',
  'Aiyedaade',
  'Aiyedire',
  'Boluwaduro',
  'Boripe',
  'Ede North',
  'Ede South',
  'Ife Central',
  'Ife East',
  'Ife North',
  'Ife South',
  'Egbedore',
  'Ejigbo',
  'Ifedayo',
  'Ifelodun',
  'Ila',
  'Ilesa East',
  'Ilesa West',
  'Irepodun',
  'Irewole',
  'Isokan',
  'Iwo',
  'Obokun',
  'Odo Otin',
  'Ola Oluwa',
  'Olorunda',
  'Oriade',
  'Orolu',
  'Osogbo',
];

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

const SearchBar = () => {
  useEffect(() => {
    console.log('API URL:', process.env.NEXT_PUBLIC_OSUNHOP_URL);
  }, []);
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [location, setLocation] = useState(null);
  const [selectedLGA, setSelectedLGA] = useState('');

  const autocompleteService = useRef(null);
  const geocoder = useRef(null);
  const {
    mutate: searchHospitals,
    isPending,
    error,
    data,
  } = useSearchHospitalsMutation();

  useEffect(() => {
    if (data) {
      console.log('Search results data:', data);
      if (data.data && data.data.hospitals) {
        data.data.hospitals.forEach((hospital, index) => {
          console.log(`Hospital ${index + 1}:`, {
            name: hospital.name,
            coordinates: hospital.location.coordinates,
            lga: hospital.location.lga,
          });
        });
      }
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error('Search error:', error);
    }
  }, [error]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = initializeGoogleServices;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeGoogleServices = () => {
    autocompleteService.current =
      new window.google.maps.places.AutocompleteService();
    geocoder.current = new window.google.maps.Geocoder();
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);

    if (value.length > 2 && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        { input: value, componentRestrictions: { country: 'NG' } },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSuggestions(predictions);
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (placeId) => {
    geocoder.current.geocode({ placeId: placeId }, (results, status) => {
      if (status === 'OK') {
        const { lat, lng } = results[0].geometry.location;
        setLocation({ lat: lat(), lng: lng() });
        setAddress(results[0].formatted_address);
        setSuggestions([]);
      }
    });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          // Reverse geocode to get address
          geocoder.current.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              if (status === 'OK') {
                setAddress(results[0].formatted_address);
              }
            }
          );
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let lat, lng;

    if (location) {
      lat = location.lat;
      lng = location.lng;
    } else if (address && geocoder.current) {
      try {
        const results = await new Promise((resolve, reject) => {
          geocoder.current.geocode({ address: address }, (results, status) => {
            if (status === 'OK') {
              resolve(results);
            } else {
              reject(
                new Error(
                  'Geocode was not successful for the following reason: ' +
                    status
                )
              );
            }
          });
        });

        console.log('Geocoding Results:', results); // Log geocoding results

        if (results && results[0]) {
          lat = results[0].geometry.location.lat();
          lng = results[0].geometry.location.lng();
        }
      } catch (error) {
        console.error('Error geocoding address:', error);
      }
    }

    // Log the lat and lng values
    console.log('Geocoded Coordinates:', { lat, lng });

    const searchParams = {
      ...(lat && lng ? { lat: lat.toFixed(6), lng: lng.toFixed(6) } : {}),
      ...(selectedLGA ? { lga: selectedLGA } : {}),
      radius: 20,
      address,
    };

    console.log('Submitting search with params:', {
      ...searchParams,
      addressUsed: address,
      locationUsed: location,
      selectedLGA,
    });

    searchHospitals(searchParams);
  };

  return (
    <div className='max-w-4xl p-4 mx-auto'>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col items-center gap-4 p-4 rounded-lg shadow-lg text-accent-800 bg-accent-200 md:flex-row'
      >
        <div className='relative flex-1 w-full'>
          <div className='relative'>
            <Search className='absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2' />
            <input
              type='text'
              placeholder='Enter address...'
              className='w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-200'
              value={address}
              onChange={handleAddressChange}
            />
          </div>
          {suggestions.length > 0 && (
            <ul className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg'>
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  className='px-4 py-2 cursor-pointer hover:bg-gray-100'
                  onClick={() => handleSuggestionSelect(suggestion.place_id)}
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='flex-1 w-full'>
          <button
            type='button'
            onClick={handleGetLocation}
            className='flex items-center justify-center w-full px-4 py-2 bg-gray-100 border rounded-lg text-accent-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-200'
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className='mr-2 animate-spin' size={20} />
            ) : (
              <MapPin className='mr-2' size={20} />
            )}
            {location ? 'Location Set' : 'Use My Location'}
          </button>
        </div>

        <div className='flex-1 w-full'>
          <div className='relative'>
            <ChevronDown className='absolute text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2' />
            <select
              value={selectedLGA}
              onChange={(e) => setSelectedLGA(e.target.value)}
              className='w-full py-2 pl-4 pr-10 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-accent-200'
            >
              <option value=''>Select Local Government</option>
              {osunLGAs.map((lga) => (
                <option key={lga} value={lga}>
                  {lga}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type='submit'
          className='w-12 h-12 p-0 text-white transition-colors bg-yellow-400 rounded-full hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2'
          aria-label='Search'
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className='w-6 h-6 mx-auto animate-spin' />
          ) : (
            <Search className='w-6 h-6 mx-auto' />
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
