
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table } from '../types';
import * as api from '../services/api';

interface TableContextType {
  table: Table | null;
  loading: boolean;
  error: string | null;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [table, setTable] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { qrSlug } = useParams<{ qrSlug: string }>();

  useEffect(() => {
    if (qrSlug) {
      const fetchTableInfo = async () => {
        setLoading(true);
        setError(null);
        try {
          const tableData = await api.getTableBySlug(qrSlug);
          setTable(tableData);
        } catch (err: any) {
          setError(err.message || 'Invalid table QR code.');
        } finally {
          setLoading(false);
        }
      };
      fetchTableInfo();
    }
  }, [qrSlug]);

  return (
    <TableContext.Provider value={{ table, loading, error }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};
