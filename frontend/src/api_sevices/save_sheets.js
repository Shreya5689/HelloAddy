import api from "./middleware";

const saveSheetsApi = {
  /*
  POST /problems/save_sheet
  Body: { name: "Sheet Name", problems: [...] }
  */
  saveSheet: (body) => api.post("/problems/save_sheet", body),

  /*
  GET /problems/sheets
  */
  getSheets: () => api.get("/problems/sheets"),

  /*
  GET /problems/sheets/:id
  Returns: { sheet: {...}, problems: [...] }
  */
  getSheetDetails: (id) => api.get(`/problems/sheets/${id}`),

  /*
  DELETE /problems/sheets/:id
  */
  deleteSheet: (id) => api.delete(`/problems/sheets/${id}`),
};

export default saveSheetsApi;