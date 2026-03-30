const ItemManager = (storageKey) => {
  let items = JSON.parse(localStorage.getItem(storageKey)) || [];

  const saveToStorage = () => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  };

  const add = (itemData) => {
    const newItem = {
      ...itemData,
      id: Date.now().toString()
    };
    items.push(newItem);
    saveToStorage();
    return newItem;
  };

  const getAll = () => [...items];

  const getById = (id) => items.find(item => item.id === id);

  const update = (id, updatedData) => {
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedData };
      saveToStorage();
      return items[index];
    }
    return null;
  };

  const remove = (id) => {
    const initialLength = items.length;
    items = items.filter(item => item.id !== id);
    if (items.length !== initialLength) {
      saveToStorage();
      return true;
    }
    return false;
  };

  const clearAll = () => {
    items = [];
    saveToStorage();
  };

  return {
    add,
    getAll,
    getById,
    update,
    remove,
    clearAll
  };
};