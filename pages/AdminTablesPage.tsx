import React, { useState, useEffect } from 'react';
import { QrCode, PlusCircle, ExternalLink } from 'lucide-react';
import * as api from '../services/api';
import { Table } from '../types';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import QRCodeModal from '../components/QRCodeModal';

const AdminTablesPage: React.FC = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);

    useEffect(() => {
        const fetchTables = async () => {
            setLoading(true);
            try {
                const tablesData = await api.getTables();
                setTables(tablesData);
            } catch (error) {
                alert("Could not load table data.");
            } finally {
                setLoading(false);
            }
        };
        fetchTables();
    }, []);

    const handleGenerateQR = (table: Table) => {
        setSelectedTable(table);
    };
    
    const handleAddTable = () => {
        alert("Add new table functionality to be implemented.");
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-neutral-dark">Table Management</h1>
                <Button onClick={handleAddTable}>
                    <PlusCircle size={20} /> Add Table
                </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {tables.map(table => (
                    <div key={table.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center">
                        <h2 className="text-5xl font-bold text-neutral-dark">{table.number}</h2>
                        <p className="text-lg font-semibold text-neutral mb-4">Table</p>
                        <div className="flex flex-col gap-2 w-full mt-2">
                            <Button onClick={() => handleGenerateQR(table)} variant="secondary" className="w-full">
                                <QrCode size={20} />
                                Generate QR
                            </Button>
                            <a href={`#/m/${table.qrSlug}`} target="_blank" rel="noopener noreferrer" className="w-full">
                                <Button variant="ghost" className="w-full border border-neutral-light">
                                    <ExternalLink size={18} />
                                    View Menu
                                </Button>
                            </a>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Slug: {table.qrSlug}</p>
                    </div>
                ))}
            </div>
             <div className="mt-8 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 rounded-md">
                <h3 className="font-bold">How to Use</h3>
                <p className="text-sm">Click "Generate QR" to get a scannable code for mobile testing. Use "View Menu" to test directly on your computer.</p>
            </div>

            {selectedTable && (
                <QRCodeModal 
                    table={selectedTable} 
                    onClose={() => setSelectedTable(null)} 
                />
            )}
        </div>
    );
};

export default AdminTablesPage;