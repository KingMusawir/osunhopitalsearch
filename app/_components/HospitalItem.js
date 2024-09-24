import React from 'react';

const getDirectionsUrl = (coordinates) => {
  return `https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}`;
};

const HospitalItem = React.memo(
  ({ hospital, isHighlighted, onHospitalClick }) => {
    return (
      <li
        className={`p-4 mb-4 border rounded shadow text-accent-600 border-accent-900 cursor-pointer ${
          isHighlighted ? 'bg-yellow-100' : ''
        }`}
        onClick={() => onHospitalClick(hospital._id)}
      >
        <h2 className='text-xl font-semibold'>{hospital.name}</h2>
        <p>Address: {hospital.location.address}</p>
        <p>LGA: {hospital.location.lga}</p>
        <p>Phone: {hospital.phone}</p>
        <p>Operating Hours: {hospital.operatingHours}</p>
        <a
          href={getDirectionsUrl(hospital.location.coordinates)}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center justify-center gap-2 px-4 py-2 mt-2 text-lg font-medium border rounded-lg text-accent-700 border-accent-600 hover:bg-accent-600 hover:text-accent-100'
          onClick={(e) => e.stopPropagation()}
          aria-label={`Get directions to ${hospital.name}`}
        >
          <svg
            enable-background='new 0 0 24 24'
            height='18'
            viewBox='0 0 24 24'
            width='18'
            focusable='false'
            class='zKmjoe NMm5M'
          >
            <g>
              <rect fill='none' height='24' width='24'></rect>
            </g>
            <g>
              <g>
                <path d='m21.41 10.59-7.99-8a1.993 1.993 0 00-2.83 0l-8.01 8c-.78.78-.78 2.05 0 2.83l8.01 8c.39.39.9.59 1.41.59.51 0 1.02-.2 1.41-.59l7.99-8c.8-.79.8-2.05.01-2.83zM12.01 20 4 12l8-8 8 8-7.99 8z'></path>
                <path d='M8 11v4h2v-3h3.5v2.5L17 11l-3.5-3.5V10H9c-.55 0-1 .45-1 1z'></path>
              </g>
            </g>
          </svg>
          Get Directions
        </a>
      </li>
    );
  }
);

HospitalItem.displayName = 'HospitalItem';

export default HospitalItem;
