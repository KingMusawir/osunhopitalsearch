import React, { forwardRef } from 'react';
import HospitalItem from './HospitalItem';

const HospitalList = forwardRef(
  ({ hospitals, highlightedHospitalId, onHospitalClick }, ref) => {
    return (
      <div className='container p-4 mx-auto'>
        <h1 className='mb-4 text-2xl font-bold text-accent-600'>
          Search Results
        </h1>
        <ul ref={ref} aria-label='List of hospitals'>
          {hospitals.map((hospital) => (
            <HospitalItem
              key={hospital._id}
              hospital={hospital}
              isHighlighted={hospital._id === highlightedHospitalId}
              onHospitalClick={onHospitalClick}
            />
          ))}
        </ul>
      </div>
    );
  }
);

HospitalList.displayName = 'HospitalList';

export default HospitalList;
