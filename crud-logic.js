const StorageKey = 'crud_items';

class Item {
    constructor(id, name, description, createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt || new Date().toISOString();
    }
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getAllItems() {
    try {
        const itemsJson = localStorage.getItem(StorageKey);
        return itemsJson ? JSON.parse(itemsJson) : [];
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
    }
}

function saveAllItems(items) {
    try {
        localStorage.setItem(StorageKey, JSON.stringify(items));
        return true;
    } catch (error) {
        console.error('Error writing to localStorage:', error);
        return false;
    }
}

function addItem(name, description) {
    if (!name || typeof name !== 'string' || name.trim() === '') {
        throw new Error('Item name is required and must be a non-empty string.');
    }

    const items = getAllItems();
    const newItem = new Item(
        generateId(),
        name.trim(),
        (description && typeof description === 'string') ? description.trim() : '',
        new Date().toISOString()
    );

    items.push(newItem);
    const success = saveAllItems(items);
    if (!success) {
        throw new Error('Failed to save item to storage.');
    }
    return newItem;
}

function displayItems(filterCallback = null) {
    let items = getAllItems();
    if (filterCallback && typeof filterCallback === 'function') {
        items = items.filter(filterCallback);
    }
    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getItemById(id) {
    if (!id || typeof id !== 'string') {
        throw new Error('Valid item ID is required.');
    }
    const items = getAllItems();
    return items.find(item => item.id === id) || null;
}

function editItem(id, updates) {
    if (!id || typeof id !== 'string') {
        throw new Error('Valid item ID is required.');
    }
    if (!updates || typeof updates !== 'object') {
        throw new Error('Updates must be a valid object.');
    }

    const items = getAllItems();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) {
        throw new Error(`Item with ID "${id}" not found.`);
    }

    const allowedUpdates = ['name', 'description'];
    const updatedItem = { ...items[index] };

    for (const key of allowedUpdates) {
        if (key in updates) {
            if (key === 'name' && (!updates[key] || typeof updates[key] !== 'string' || updates[key].trim() === '')) {
                throw new Error('Item name must be a non-empty string.');
            }
            updatedItem[key] = (typeof updates[key] === 'string') ? updates[key].trim() : updates[key];
        }
    }

    items[index] = updatedItem;
    const success = saveAllItems(items);
    if (!success) {
        throw new Error('Failed to save updated item to storage.');
    }
    return updatedItem;
}

function deleteItem(id) {
    if (!id || typeof id !== 'string') {
        throw new Error('Valid item ID is required.');
    }

    const items = getAllItems();
    const initialLength = items.length;
    const filteredItems = items.filter(item => item.id !== id);

    if (filteredItems.length === initialLength) {
        throw new Error(`Item with ID "${id}" not found.`);
    }

    const success = saveAllItems(filteredItems);
    if (!success) {
        throw new Error('Failed to delete item from storage.');
    }
    return true;
}

function clearAllItems() {
    try {
        localStorage.removeItem(StorageKey);
        return true;
    } catch (error) {
        console.error('Error clearing storage:', error);
        return false;
    }
}

export {
    Item,
    addItem,
    displayItems,
    getItemById,
    editItem,
    deleteItem,
    clearAllItems,
    getAllItems
};