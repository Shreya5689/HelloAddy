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
  updateItem: (id, body) => api.patch(`/wishlist/item/${id}`, body),

//   /*
//   DELETE /items/:id
//   */
  deleteItem: (id) => api.delete(`/wishlist/items/${id}`),

  
  /*
  PUT /item/:id
  */
  updateItemById: (id, body) => api.put(`/wishlist/items/${id}`, body),

};

export default wishlistApi;



