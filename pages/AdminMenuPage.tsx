
import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import * as api from '../services/api';
import { MenuItem, MenuCategory } from '../types';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

// This is a simplified version. A real implementation would use a modal form for editing/creating.
const AdminMenuPage: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [items, cats] = await Promise.all([api.getMenuItems({}), api.getMenuCategories()]);
            setMenuItems(items);
            setCategories(cats);
        } catch (error) {
            console.error("Failed to fetch menu data", error);
            alert("Could not load menu data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getCategoryName = (categoryId: string) => {
        return categories.find(c => c.id === categoryId)?.name || 'Uncategorized';
    };
    
    // In a real app, these functions would trigger modals with forms
    const handleAddItem = () => alert("Add new item functionality to be implemented.");
    const handleEditItem = (item: MenuItem) => alert(`Editing item: ${item.name}`);
    const handleDeleteItem = (itemId: string) => {
        if(window.confirm("Are you sure you want to delete this item?")) {
            alert(`Deleting item ID: ${itemId}`);
        }
    };
    
    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-neutral-dark">Menu Management</h1>
                <Button onClick={handleAddItem}>
                    <PlusCircle size={20} /> Add Menu Item
                </Button>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {menuItems.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                      <img className="h-10 w-10 rounded-full object-cover" src={item.imageUrl} alt={item.name} />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getCategoryName(item.categoryId)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {item.availability ? 'Available' : 'Unavailable'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex gap-2 justify-end">
                                      <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}><Edit size={16} /></Button>
                                      <Button variant="ghost" size="sm" className="text-danger" onClick={() => handleDeleteItem(item.id)}><Trash2 size={16} /></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminMenuPage;
