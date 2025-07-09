import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];

  // Simple pagination logic: show up to 5 pages with ellipsis if needed
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (currentPage <= 3) {
    startPage = 1;
    endPage = Math.min(totalPages, maxPagesToShow);
  } else if (currentPage > totalPages - 3) {
    startPage = Math.max(1, totalPages - (maxPagesToShow - 1));
    endPage = totalPages;
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="btn-group justify-center mt-8">
      <button
        className="btn btn-outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {startPage > 1 && (
        <>
          <button className={`btn btn-outline`} onClick={() => onPageChange(1)}>
            1
          </button>
          {startPage > 2 && <span className="btn btn-disabled">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          className={`btn ${page === currentPage ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="btn btn-disabled">...</span>}
          <button className="btn btn-outline" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        className="btn btn-outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
