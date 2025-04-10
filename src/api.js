import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api", // Ajustado al puerto que funciona
});

// Agregar el token a todas las solicitudes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Endpoint para iniciar sesión
export const loginEndpoint = async (credentials) => {
  try {
    const response = await api.post("/Acceso/IniciarSesion", credentials);
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

// Endpoint para registrarse
export const registerEndpoint = async (userData) => {
  try {
    const response = await api.post("/Acceso/Registrarse", userData);
    return response.data;
  } catch (error) {
    console.error("Error al registrarse:", error);
    throw error;
  }
};

// Obtener datos del perfil
export const getProfile = async () => {
  try {
    const response = await api.get("/Usuario/perfil");
    return response.data;
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    throw error;
  }
};

// Obtener datos del rol
export const getRole = async (idRol) => {
  try {
    const response = await api.get(`/Rol/GetRol?id=${idRol}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el rol:", error);
    throw error;
  }
};

// Editar perfil
export const updateProfile = async (id, userData) => {
  try {
    const response = await api.put(`/Usuario/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error al editar el perfil:", error);
    throw error;
  }
};

// Eliminar perfil
export const deleteProfile = async (id) => {
  try {
    const response = await api.delete(`/Usuario/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el perfil:", error);
    throw error;
  }
};

// Obtener lista de archivos
export const getFiles = async () => {
  try {
    const response = await api.get("/Archivo");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los archivos:", error);
    throw error;
  }
};

// Obtener archivo por ID
export const getFileById = async (id) => {
  try {
    const response = await api.get(`/Archivo/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el archivo:", error);
    throw error;
  }
};

// Obtener usuario por ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/Usuario/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    throw error;
  }
};

// Obtener archivos del usuario autenticado
export const getFilesByUser = async () => {
  try {
    const response = await api.get("/Archivo/GetByUser");
    return response.data;
  } catch (error) {
    console.error("Error al obtener archivos del usuario:", error);
    throw error;
  }
};

// Subir nuevo archivo
export const uploadFile = async (fileData) => {
  try {
    const response = await api.post("/Archivo", fileData);
    return response.data;
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    throw error;
  }
};

// Modificar archivo existente
export const updateFile = async (id, fileData) => {
  try {
    const response = await api.put(`/Archivo/${id}`, fileData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el archivo:", error);
    throw error;
  }
};

// Eliminar archivo
export const deleteFile = async (id) => {
  try {
    const response = await api.delete(`/Archivo/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el archivo:", error);
    throw error;
  }
};

// --- Nuevas funciones para Favoritos ---

// Obtener todos los favoritos
export const getFavorites = async () => {
  try {
    const response = await api.get("/Favorito");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los favoritos:", error);
    throw error;
  }
};

// Agregar un archivo a favoritos
export const addFavorite = async (favoriteData) => {
  try {
    const response = await api.post("/Favorito", favoriteData);
    return response.data;
  } catch (error) {
    console.error("Error al agregar a favoritos:", error);
    throw error;
  }
};

// Obtener un favorito por ID
export const getFavoriteById = async (id) => {
  try {
    const response = await api.get(`/Favorito/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el favorito por ID:", error);
    throw error;
  }
};

// Modificar un favorito
export const updateFavorite = async (id, favoriteData) => {
  try {
    const response = await api.put(`/Favorito/${id}`, favoriteData);
    return response.data;
  } catch (error) {
    console.error("Error al modificar el favorito:", error);
    throw error;
  }
};

// Eliminar un favorito
export const deleteFavorite = async (id) => {
  try {
    const response = await api.delete(`/Favorito/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el favorito:", error);
    throw error;
  }
};

export const getPlaylists = async () => {
  try {
    console.log("Solicitando GET /ListaDeReproduccion");
    const response = await api.get("/ListaDeReproduccion");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las listas de reproducción:", error);
    console.error("URL intentada:", error.config?.url);
    throw error;
  }
};

export const createPlaylist = async (playlistData) => {
  try {
    console.log("Solicitando POST /ListaDeReproduccion con datos:", playlistData);
    const response = await api.post("/ListaDeReproduccion", playlistData);
    return response.data;
  } catch (error) {
    console.error("Error al crear la lista de reproducción:", error);
    console.error("URL intentada:", error.config?.url);
    console.error("Respuesta del servidor:", error.response?.data);
    throw error;
  }
};

export const addFilesToPlaylist = async (playlistId, fileIds) => {
  try {
    console.log(`Solicitando POST /ListaDeReproduccion/${playlistId}/archivos con archivos:`, fileIds);
    const response = await api.post(`/ListaDeReproduccion/${playlistId}/archivos`, {
      archivos: fileIds.map((id) => ({ idArchivo: id })),
    });
    return response.data;
  } catch (error) {
    console.error("Error al añadir archivos a la lista:", error);
    console.error("URL intentada:", error.config?.url);
    throw error;
  }
};

export const getPlaylistById = async (id) => {
  try {
    console.log(`Solicitando GET /ListaDeReproduccion/${id}`);
    const response = await api.get(`/ListaDeReproduccion/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la lista de reproducción:", error);
    throw error;
  }
};

export const updatePlaylist = async (id, playlistData) => {
  try {
    console.log(`Solicitando PUT /ListaDeReproduccion/${id} con datos:`, playlistData);
    const response = await api.put(`/ListaDeReproduccion/${id}`, playlistData);
    return response.data;
  } catch (error) {
    console.error("Error al modificar la lista de reproducción:", error);
    throw error;
  }
};

export const deletePlaylist = async (id) => {
  try {
    console.log(`Solicitando DELETE /ListaDeReproduccion/${id}`);
    const response = await api.delete(`/ListaDeReproduccion/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la lista de reproducción:", error);
    console.error("URL intentada:", error.config?.url);
    console.error("Respuesta del servidor:", error.response?.data);
    throw error;
  }
};

//factura
// Obtener todas las facturas
export const getInvoices = async () => {
  try {
    console.log("Solicitando GET /Factura");
    const response = await api.get("/Factura");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las facturas:", error);
    throw error;
  }
};

// Obtener métodos de pago
export const getPaymentMethods = async () => {
  try {
    console.log("Solicitando GET /MetodoPago");
    const response = await api.get("/MetodoPago");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los métodos de pago:", error);
    throw error;
  }
};

// Obtener pagos del usuario autenticado
export const getPayments = async () => {
  try {
    console.log("Solicitando GET /Pago");
    const response = await api.get("/Pago");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los pagos:", error);
    throw error;
  }
};

// Crear un nuevo pago
export const createPayment = async (paymentData) => {
  try {
    console.log("Solicitando POST /Pago con datos:", paymentData);
    const response = await api.post("/Pago", paymentData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el pago:", error);
    console.error("Respuesta del servidor:", error.response?.data);
    throw error;
  }
};

//Creditos


// Obtener créditos disponibles
export const getCredits = async () => {
  console.log("Solicitando GET /Credito");
  const response = await api.get("/Credito");
  return response.data;
};

// Agregar créditos
export const addCredits = async (creditData) => {
  console.log("Solicitando POST /Credito con datos:", creditData);
  const response = await api.post("/Credito", creditData);
  return response.data;
};

// Crear factura
export const createInvoice = async (invoiceData) => {
  console.log("Solicitando POST /Factura con datos:", invoiceData);
  const response = await api.post("/Factura", invoiceData);
  return response.data;
};

export default api;


