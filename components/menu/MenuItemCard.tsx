
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { MenuItem } from '../../types';
import Button from '../ui/Button';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform hover:scale-105 transition-transform duration-300">
      <div className="h-48 overflow-hidden">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-neutral-dark">{item.name}</h3>
        <p className="text-neutral flex-grow mt-2 text-sm">{item.description}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-semibold text-primary">${item.price.toFixed(2)}</p>
          {item.availability ? (
            <Button size="sm" onClick={() => onAddToCart(item)}>
              <PlusCircle size={16} /> Add
            </Button>
          ) : (
            <span className="text-sm font-semibold text-danger bg-red-100 px-2 py-1 rounded">Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
