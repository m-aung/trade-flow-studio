import React from 'react';
import Input from '../Input';
import Select from '../Select';

interface FilterOption {
  value: string;
  label: string;
}

interface TableFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterOptions?: FilterOption[];
  selectedFilter?: string;
  onFilterChange?: (value: string) => void;
}

const TableFilter: React.FC<TableFilterProps> = ({
  searchValue,
  onSearchChange,
  filterOptions,
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="flex-1">
        <Input
          type="search"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      {filterOptions && (
        <div className="w-full sm:w-48">
          <Select
            options={filterOptions}
            value={selectedFilter}
            onChange={(e) => onFilterChange?.(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default TableFilter; 