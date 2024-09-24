import React, { useState, useEffect, useRef } from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const [visiblePages, setVisiblePages] = useState(5);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateVisiblePages = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const buttonWidth = 40; // Estimated width of each page button
        const controlsWidth = 200; // Estimated width of First, Prev, Next, Last buttons
        const availableWidth = containerWidth - controlsWidth;
        const calculatedVisiblePages = Math.floor(availableWidth / buttonWidth);
        setVisiblePages(
          Math.max(3, Math.min(calculatedVisiblePages, totalPages))
        );
      }
    };

    updateVisiblePages();
    window.addEventListener('resize', updateVisiblePages);
    return () => window.removeEventListener('resize', updateVisiblePages);
  }, [totalPages]);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const halfVisiblePages = Math.floor(visiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisiblePages);
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      ref={containerRef}
      className='flex items-center justify-center w-full mt-4 space-x-1 sm:space-x-2'
    >
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className='px-2 py-1 text-xs text-white rounded sm:text-sm bg-accent-700 disabled:bg-gray-300'
      >
        First
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='px-2 py-1 text-xs text-white rounded sm:text-sm bg-accent-700 disabled:bg-gray-300'
      >
        Prev
      </button>
      {pageNumbers[0] > 1 && <span className='px-1 sm:px-2'>...</span>}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-2 py-1 text-xs sm:text-sm rounded ${
            currentPage === number
              ? 'bg-accent-700 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {number}
        </button>
      ))}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <span className='px-1 sm:px-2'>...</span>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='px-2 py-1 text-xs text-white rounded sm:text-sm bg-accent-700 disabled:bg-gray-300'
      >
        Next
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className='px-2 py-1 text-xs text-white rounded sm:text-sm bg-accent-700 disabled:bg-gray-300'
      >
        Last
      </button>
    </div>
  );
}
