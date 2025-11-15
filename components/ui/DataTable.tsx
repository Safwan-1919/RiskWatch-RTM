
import React from 'react';
import { Card, CardContent } from './Card';
import Spinner from './Spinner';
import { cn } from '../../lib/utils';

interface DataTableProps<T> {
  data: T[];
  columns: { header: string; accessor: (item: T) => React.ReactNode }[];
  isLoading?: boolean;
  title: string;
  onRowClick?: (item: T) => void;
}

const DataTable = <T,>({ data, columns, isLoading, title, onRowClick }: DataTableProps<T>) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50">
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className="px-6 py-3 font-medium text-muted-foreground">{col.header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-16">
                    <div className="flex justify-center items-center">
                      <Spinner className="h-8 w-8 text-primary" />
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-16 text-muted-foreground">
                    No {title} found.
                  </td>
                </tr>
              ) : (
                data.map((item, rowIndex) => (
                  <tr 
                    key={rowIndex} 
                    className={cn(
                        'hover:bg-muted/50 transition-colors',
                        onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                        {col.accessor(item)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;