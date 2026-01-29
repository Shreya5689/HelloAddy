import { create } from "zustand";
import workspaceApi from "../api_sevices/workspace";

const useWorkspaceStore = create((set) => ({
  attempted: [],
  marked: [],
  important: [],

  fetchWorkspace: async () => {
    try {
      const res = await workspaceApi.getWorkspace();
      set({
        attempted: res.data.attempted || [],
        marked: res.data.marked || [],
        important: res.data.important || [],
      });
    } catch (err) { console.error("Failed to fetch workspace", err); }
  },

  // Generic add function
  addItem: async (item, category) => {
    try {
      const res = await workspaceApi.addWorkspaceItem({ ...item, category });
      set((state) => ({
        [category]: [...state[category], res.data],
      }));
    } catch (err) { console.error(`Failed to add ${category}`, err); }
  },

  toggleDone: async (id, currentCategory) => {
    // Optimistic UI update
    set((state) => ({
      [currentCategory]: state[currentCategory].map((i) =>
        i.id === id ? { ...i, done: !i.done } : i
      ),
    }));

    try {
      await workspaceApi.toggleDone(id);
    } catch (err) { console.error(err); }
  },

  removeItem: async (id, category) => {
    try {
      await workspaceApi.removeWorkspaceItem(id);
      set((state) => ({
        [category]: state[category].filter((i) => i.id !== id),
      }));
    } catch (err) { console.error(err); }
  },
}));

export default useWorkspaceStore;