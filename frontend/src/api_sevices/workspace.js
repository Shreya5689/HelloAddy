import api from "./middleware";

/*
NOTE:
- baseURL is already handled in middleware.js
- withCredentials: true is set in middleware.js
- headers are already JSON by default in axios
*/

const workspaceApi = {
  /*
  GET /workspace
  Returns workspace data with attempted, marked, important arrays
  */
  getWorkspace: () => api.get("/workspace"),

  /*
  POST /workspace/attempted
  BODY: { title, url, platform, done }
  */
  addAttempted: (item) => api.post("/workspace/attempted", item),

  /*
  PATCH /workspace/:id
  Toggle done status
  */
  toggleAttempted: (id) => api.patch(`/workspace/${id}`),

  /*
  DELETE /workspace/attempted/:id
  Remove an attempted item
  */
  removeAttempted: (id) => api.delete(`/workspace/attempted/${id}`),
};

export default workspaceApi;
