import { MOCK_USERS, MOCK_MENU_ITEMS, MOCK_CATEGORIES, MOCK_TABLES, MOCK_ORDERS } from './mockData';
import { User, Role, MenuItem, MenuCategory, Table, Order, OrderStatus } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const login = async (email: string, password: string): Promise<User> => {
  await delay(500);
  const user = MOCK_USERS.find(u => u.email === email);
  // In a real app, you would check a hashed password
  if (user && password === 'password') { // Using a dummy password
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  throw new Error('Invalid email or password');
};

export const getMenuItems = async (params: { search?: string; category?: string }): Promise<MenuItem[]> => {
  await delay(300);
  // In a real app, filtering would happen on the server
  return MOCK_MENU_ITEMS;
};

export const getMenuCategories = async (): Promise<MenuCategory[]> => {
  await delay(200);
  return MOCK_CATEGORIES;
};

export const getTableBySlug = async (slug: string): Promise<Table> => {
  await delay(200);
  const table = MOCK_TABLES.find(t => t.qrSlug === slug);
  if (table) {
    return table;
  }
  throw new Error('Invalid table. Please scan a valid QR code.');
};

export const getTables = async (): Promise<Table[]> => {
  await delay(400);
  return MOCK_TABLES;
};


export const placeOrder = async (orderData: { tableId: string, items: { id: string, quantity: number, note: string }[] }): Promise<Order> => {
  await delay(1000);
  const table = MOCK_TABLES.find(t => t.id === orderData.tableId);
  if (!table) throw new Error("Table not found");

  const newOrder: Order = {
    id: `order_${Date.now()}`,
    tableId: orderData.tableId,
    tableNumber: table.number,
    items: orderData.items.map(item => {
        const menuItem = MOCK_MENU_ITEMS.find(mi => mi.id === item.id);
        if (!menuItem) throw new Error("Menu item not found");
        return {
            menuItemId: item.id,
            quantity: item.quantity,
            note: item.note,
            price: menuItem.price,
            name: menuItem.name
        }
    }),
    status: OrderStatus.PLACED,
    total: orderData.items.reduce((sum, item) => {
        const menuItem = MOCK_MENU_ITEMS.find(mi => mi.id === item.id);
        return sum + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0),
    createdAt: new Date().toISOString(),
  };

  MOCK_ORDERS.unshift(newOrder);
  return newOrder;
};

export const getOrders = async (params: { status?: OrderStatus; table?: string }): Promise<Order[]> => {
    await delay(500);
    // Simulate new orders appearing
    if (Math.random() < 0.1 && MOCK_ORDERS[0]?.status !== OrderStatus.PLACED) {
      // Add a new random order sometimes
      const randomTable = MOCK_TABLES[Math.floor(Math.random() * MOCK_TABLES.length)];
      const randomItem1 = MOCK_MENU_ITEMS[Math.floor(Math.random() * MOCK_MENU_ITEMS.length)];
      const randomItem2 = MOCK_MENU_ITEMS[Math.floor(Math.random() * MOCK_MENU_ITEMS.length)];
      const newRandomOrder: Order = {
        id: `order_rand_${Date.now()}`,
        tableId: randomTable.id,
        tableNumber: randomTable.number,
        items: [{menuItemId: randomItem1.id, quantity: 1, note: 'Extra spicy', price: randomItem1.price, name: randomItem1.name}, {menuItemId: randomItem2.id, quantity: 2, note: '', price: randomItem2.price, name: randomItem2.name}],
        status: OrderStatus.PLACED,
        total: randomItem1.price + randomItem2.price * 2,
        createdAt: new Date().toISOString()
      };
      MOCK_ORDERS.unshift(newRandomOrder);
    }

    return [...MOCK_ORDERS];
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  await delay(150);
  const order = MOCK_ORDERS.find(o => o.id === orderId);
  return order ? { ...order } : null;
};

export const updateOrderStatus = async (orderId: string, newStatus: OrderStatus): Promise<Order> => {
  await delay(500);
  const orderIndex = MOCK_ORDERS.findIndex(o => o.id === orderId);
  if (orderIndex > -1) {
    MOCK_ORDERS[orderIndex].status = newStatus;
    return { ...MOCK_ORDERS[orderIndex] };
  }
  throw new Error("Order not found");
};
