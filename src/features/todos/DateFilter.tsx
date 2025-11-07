import React from 'react';
import { Button } from '../../components/ui/Button';

export type DateFilterType = 'all' | 'today' | 'yesterday';

interface DateFilterProps {
  activeFilter: DateFilterType;
  onFilterChange: (filter: DateFilterType) => void;
}

export const DateFilter: React.FC<DateFilterProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={activeFilter === 'all' ? 'primary' : 'secondary'}
        onClick={() => onFilterChange('all')}
      >
        All
      </Button>
      <Button
        variant={activeFilter === 'today' ? 'primary' : 'secondary'}
        onClick={() => onFilterChange('today')}
      >
        Today
      </Button>
      <Button
        variant={activeFilter === 'yesterday' ? 'primary' : 'secondary'}
        onClick={() => onFilterChange('yesterday')}
      >
        Yesterday
      </Button>
    </div>
  );
};
