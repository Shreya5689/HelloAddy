import api from "./middleware"

const wishlistApi = {
  /*
  GET /items
  */
  getItems: () => api.get("/wishlist/item"),

  /*
  POST /items
//   */
  addItem: (body) => api.post("/wishlist/items", body),

//   /*
//   PATCH /items/:id
//   */
//   updateItem: (id, body) => api.patch(`/items/${id}`, body),

//   /*
//   DELETE /items/:id
//   */
//   deleteItem: (id) => api.delete(`/items/${id}`),
};

export default wishlistApi;



