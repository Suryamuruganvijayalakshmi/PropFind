import React, { useState } from 'react';
import PropertyCard from './PropertyCard';
import { 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal, 
  SearchX, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

export default function PropertyGrid({
  properties,
  favorites,
  onToggleFavorite,
  compareList,
  onToggleCompare,
  onViewDetails,
  onSendEnquiry,
  onDirectBuy,
  onResetFilters
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 8 or 10 per page provides great pagination over 80 items

  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price_asc', 'price_desc', 'sqft_desc'

  // Sort logic
  const sortedProperties = [...properties].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'sqft_desc') return b.sqft - a.sqft;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedProperties.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Smooth scroll back to grid top
    const section = document.getElementById('properties-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Generate page numbers with 3 dots (...) logic
  const renderPaginationItems = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 'dots', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 'dots', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, 'dots', currentPage - 1, currentPage, currentPage + 1, 'dots', totalPages);
      }
    }
    return pages;
  };

  return (
    <section id="properties-section" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Bar: Results Count & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-neutral-200/80 gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
            Curated Discovery Portfolio
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Showing <strong className="text-neutral-900">{currentItems.length}</strong> of <strong className="text-iris-600">{properties.length}</strong> matching architectural listings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-800 focus:outline-none focus:border-iris-500 cursor-pointer shadow-2xs"
          >
            <option value="featured">Featured & Curated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="sqft_desc">Largest Area (Sq Ft)</option>
          </select>
        </div>
      </div>

      {/* Grid or Empty State */}
      {currentItems.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-neutral-200 my-8">
          <SearchX className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-neutral-800">No matching properties found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
            Try adjusting your budget, location, or amenities filters to see other homes in our 80-property catalogue.
          </p>
          <button
            onClick={onResetFilters}
            className="mt-4 px-5 py-2.5 rounded-full bg-iris-600 text-white text-xs font-bold hover:bg-iris-700 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentItems.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorite={favorites.some(f => f.id === property.id)}
              onToggleFavorite={onToggleFavorite}
              isCompared={compareList.some(c => c.id === property.id)}
              onToggleCompare={onToggleCompare}
              onViewDetails={onViewDetails}
              onSendEnquiry={onSendEnquiry}
              onDirectBuy={onDirectBuy}
            />
          ))}
        </div>
      )}

      {/* Pagination Bar with "3 Dots" Selector */}
      {totalPages > 1 && (
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-200">
          
          <div className="text-xs text-neutral-500">
            Page <span className="font-bold text-neutral-800">{currentPage}</span> of <span className="font-bold text-neutral-800">{totalPages}</span> (8 listings per page)
          </div>

          <div className="flex items-center gap-1.5">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers & 3 Dots Button */}
            {renderPaginationItems().map((item, idx) => {
              if (item === 'dots') {
                return (
                  <button
                    key={`dots-${idx}`}
                    onClick={() => handlePageChange(Math.min(currentPage + 3, totalPages))}
                    title="Jump forward in pages"
                    className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                );
              }

              const isCurrent = currentPage === item;
              return (
                <button
                  key={item}
                  onClick={() => handlePageChange(item)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-iris-600 text-white shadow-sm scale-105'
                      : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {item}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </section>
  );
}
