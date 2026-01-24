import { create } from "zustand";
import wishlistApi from "../api_sevices/wishlist";

const useTodoStore = create((set, get) => ({
  todos: [],
  wishlist: [],

  // Action: Load all items from DB and sort them
  fetchItems: async () => {
    try {
      const res = await wishlistApi.getItems();
      const items = res.data;
      set({
        todos: items.filter((i) => i.type === "todo"),
        wishlist: items.filter((i) => i.type === "wishlist"),
      });
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  },

  // Action: Add new item
  addItem: async (mode, value) => {
    try {
      const res = await wishlistApi.addItem({ type: mode, value });
      const newItem = res.data;
      if (mode === "todo") {
        set((state) => ({ todos: [...state.todos, newItem] }));
      } else {
        set((state) => ({ wishlist: [...state.wishlist, newItem] }));
      }
    } catch (err) {
      console.error("Error adding item:", err);
    }
  },

  // Action: Toggle completion status
  toggleDone: async (id, listType) => {
    try {
      const list = listType === "todo" ? get().todos : get().wishlist;
      const item = list.find((i) => i.id === id);
      if (!item) return; // 🛡️ SAFETY
      const res = await wishlistApi.updateItem(id, { done: !item.done });
      const updatedItem = res.data;

      const updateList = (prev) => prev.map((i) => (i.id === id ? updatedItem : i));
      listType === "todo"
        ? set((state) => ({ todos: updateList(state.todos) }))
        : set((state) => ({ wishlist: updateList(state.wishlist) }));
    } catch (err) {
      console.error("Error toggling item:", err);
    }
  },

  // Action: Delete item
  removeItem: async (id, listType) => {
    try {
      await wishlistApi.deleteItem(id);
      const filterList = (prev) => prev.filter((i) => i.id !== id);
      listType === "todo"
        ? set((state) => ({ todos: filterList(state.todos) }))
        : set((state) => ({ wishlist: filterList(state.wishlist) }));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  },

  updateItemValue: async (itemId, newValue) => {
    try {
      const res = await wishlistApi.updateItem(itemId, { value: newValue });
      const updatedItem = res.data;

      const updateList = (prev) => prev.map((i) => (i.id === itemId ? updatedItem : i));
      set((state) => ({ wishlist: updateList(state.wishlist) }));
    } catch (err) {
      console.error("Error updating item:", err);
    }
  },

}));

export default useTodoStore;