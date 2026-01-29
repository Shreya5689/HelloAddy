import api from "./middleware";

const workspaceApi = {
  getWorkspace: () => api.get("/workspace"),
  
  // Generic add function for all categories
  addWorkspaceItem: (item) => api.post("/workspace/attempted", item),
  
  toggleDone: (id) => api.patch(`/workspace/${id}`),
  
  removeWorkspaceItem: (id) => api.delete(`/workspace/attempted/${id}`),
};

export default workspaceApi;