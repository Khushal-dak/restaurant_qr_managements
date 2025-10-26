
import { User, Role, MenuItem, MenuCategory, Table, Order, OrderStatus } from '../types';

export const MOCK_USERS: (User & { passwordHash: string })[] = [
  { id: 'user_1', name: 'Admin Ali', email: 'admin@example.com', role: Role.ADMIN, passwordHash: 'hashed_password' },
  { id: 'user_2', name: 'Staff Sam', email: 'staff@example.com', role: Role.STAFF, passwordHash: 'hashed_password' },
];

export const MOCK_CATEGORIES: MenuCategory[] = [
  { id: 'cat_1', name: 'Appetizers', displayOrder: 1 },
  { id: 'cat_2', name: 'Main Courses', displayOrder: 2 },
  { id: 'cat_3', name: 'Desserts', displayOrder: 3 },
  { id: 'cat_4', name: 'Beverages', displayOrder: 4 },
];

export const MOCK_MENU_ITEMS: MenuItem[] = [
  // Appetizers
  { id: 'item_1', name: 'Bruschetta', description: 'Grilled bread topped with tomatoes, garlic, basil, and olive oil.', price: 8.99, categoryId: 'cat_1', imageUrl: 'https://picsum.photos/id/20/400/300', availability: true, tags: ['vegetarian', 'starter'] },
  { id: 'item_2', name: 'Calamari Fritti', description: 'Lightly battered and fried squid served with marinara sauce.', price: 12.50, categoryId: 'cat_1', imageUrl: 'https://picsum.photos/id/30/400/300', availability: true, tags: ['seafood', 'fried'] },
  // Main Courses
  { id: 'item_3', name: 'Margherita Pizza', description: 'Classic pizza with fresh mozzarella, San Marzano tomatoes, and basil.', price: 15.00, categoryId: 'cat_2', imageUrl: 'https://picsum.photos/id/40/400/300', availability: true, tags: ['pizza', 'vegetarian', 'classic'] },
  { id: 'item_4', name: 'Spaghetti Carbonara', description: 'Pasta with pancetta, eggs, Pecorino Romano cheese, and black pepper.', price: 18.00, categoryId: 'cat_2', imageUrl: 'https://picsum.photos/id/50/400/300', availability: true, tags: ['pasta', 'classic'] },
  { id: 'item_5', name: 'Grilled Salmon', description: 'Salmon fillet grilled to perfection, served with asparagus and lemon.', price: 24.50, categoryId: 'cat_2', imageUrl: 'https://picsum.photos/id/60/400/300', availability: false, tags: ['seafood', 'healthy'] },
  // Desserts
  { id: 'item_6', name: 'Tiramisu', description: 'Coffee-soaked ladyfingers layered with mascarpone cream.', price: 9.00, categoryId: 'cat_3', imageUrl: 'https://picsum.photos/id/70/400/300', availability: true, tags: ['dessert', 'coffee'] },
  { id: 'item_7', name: 'Panna Cotta', description: 'Silky smooth cooked cream dessert with a berry coulis.', price: 8.50, categoryId: 'cat_3', imageUrl: 'https://picsum.photos/id/80/400/300', availability: true, tags: ['dessert', 'creamy'] },
  // Beverages
  { id: 'item_8', name: 'Espresso', description: 'A strong shot of Italian coffee.', price: 3.50, categoryId: 'cat_4', imageUrl: 'https://picsum.photos/id/90/400/300', availability: true, tags: ['drink', 'coffee'] },
  { id: 'item_9', name: 'San Pellegrino', description: 'Sparkling natural mineral water.', price: 4.00, categoryId: 'cat_4', imageUrl: 'https://picsum.photos/id/100/400/300', availability: true, tags: ['drink', 'water'] },
];

export const MOCK_TABLES: Table[] = [
  { id: 'table_1', number: 1, qrSlug: 'table-1-secret' },
  { id: 'table_2', number: 2, qrSlug: 'table-2-secret' },
  { id: 'table_3', number: 3, qrSlug: 'table-3-secret' },
  { id: 'table_4', number: 4, qrSlug: 'table-4-secret' },
  { id: 'table_5', number: 5, qrSlug: 'table-5-secret' },
  { id: 'table_6', number: 6, qrSlug: 'table-6-secret' },
];

export const MOCK_ORDERS: Order[] = [
    {
        id: 'order_1',
        tableId: 'table_1',
        tableNumber: 1,
        items: [
            { menuItemId: 'item_3', quantity: 1, note: 'Extra basil', name: 'Margherita Pizza', price: 15.00 },
            { menuItemId: 'item_9', quantity: 2, note: '', name: 'San Pellegrino', price: 4.00 },
        ],
        status: OrderStatus.PLACED,
        total: 23.00,
        createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
    },
    {
        id: 'order_2',
        tableId: 'table_3',
        tableNumber: 3,
        items: [
            { menuItemId: 'item_4', quantity: 1, note: 'No pepper', name: 'Spaghetti Carbonara', price: 18.00 },
        ],
        status: OrderStatus.PREPARING,
        total: 18.00,
        createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    },
    {
        id: 'order_3',
        tableId: 'table_2',
        tableNumber: 2,
        items: [
            { menuItemId: 'item_6', quantity: 2, note: '', name: 'Tiramisu', price: 9.00 },
        ],
        status: OrderStatus.READY,
        total: 18.00,
        createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    },
];
