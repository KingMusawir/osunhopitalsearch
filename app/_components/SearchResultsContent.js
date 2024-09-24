'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../_lib/react-query-config';
import HospitalList from '../_components/HospitalList';
import HospitalMap from '../_components/HospitalMap';
import Pagination from '../_components/Pagination';
import { normalizeHospitalData } from '../_utils/normalizeHospitalData';

const ITEMS_PER_PAGE = 10;

export default function SearchResultsContent() {
  const [hospitals, setHospitals] = useState([]);
  const [mapHospitals, setMapHospitals] = useState([]);
  const [highlightedHospitalId, setHighlightedHospitalId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const listRef = useRef(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['hospitals'],
    initialData: () => queryClient.getQueryData(['hospitals']),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (data) {
      const normalizedData = normalizeHospitalData(data);
      setHospitals(normalizedData.list);
      setMapHospitals(normalizedData.map);
    }
  }, [data]);

  const totalPages = useMemo(
    () => Math.ceil(hospitals.length / ITEMS_PER_PAGE),
    [hospitals]
  );

  const paginatedHospitals = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return hospitals.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [hospitals, currentPage]);

  const handleHospitalClick = useCallback(
    (hospitalId) => {
      setHighlightedHospitalId(hospitalId);

      const overallIndex = hospitals.findIndex((h) => h._id === hospitalId);
      if (overallIndex !== -1) {
        const page = Math.floor(overallIndex / ITEMS_PER_PAGE) + 1;
        setCurrentPage(page);

        setTimeout(() => {
          const itemIndex = overallIndex % ITEMS_PER_PAGE;
          const itemElement = listRef.current?.children[itemIndex];
          itemElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 0);
      }
    },
    [hospitals]
  );

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    setHighlightedHospitalId(null);
    listRef.current?.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        Loading hospital data...
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex items-center justify-center h-screen'>
        An error occurred: {error.message}
      </div>
    );
  }

  if (hospitals.length === 0 || mapHospitals.length === 0) {
    return (
      <div className='flex items-center justify-center h-screen'>
        No hospital data available.
      </div>
    );
  }

  return (
    <div className='flex flex-col h-screen md:flex-row'>
      <div className='w-full md:w-[70%] h-full p-4'>
        <HospitalMap
          hospitals={mapHospitals}
          onHospitalClick={handleHospitalClick}
          highlightedHospitalId={highlightedHospitalId}
        />
      </div>
      <div className='w-full md:w-[30%] h-full flex flex-col overflow-hidden'>
        <div className='flex-grow p-4 overflow-y-auto'>
          <HospitalList
            ref={listRef}
            hospitals={paginatedHospitals}
            highlightedHospitalId={highlightedHospitalId}
            onHospitalClick={handleHospitalClick}
          />
        </div>
        <div className='p-4'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
