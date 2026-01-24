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
    } catch (err) {
      console.error("Failed to fetch workspace", err);
    }
  },

  addAttempted: async (item) => {
    try {
      const res = await workspaceApi.addAttempted(item);
      set((state) => ({
        attempted: [...state.attempted, res.data],
      }));
    } catch (err) {
      console.error("Failed to add attempted", err);
    }
  },

  toggleAttemptedDone: async (id) => {
    set((state) => ({
      attempted: state.attempted.map((i) =>
        i.id === id ? { ...i, done: !i.done } : i
      ),
    }));

    try {
      await workspaceApi.toggleAttempted(id);
    } catch (err) {
      console.error(err);
    }
  },

  removeAttempted: async (id) => {
    try {
      await workspaceApi.removeAttempted(id);
      set((state) => ({
        attempted: state.attempted.filter((i) => i.id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  },
}));

export default useWorkspaceStore;
