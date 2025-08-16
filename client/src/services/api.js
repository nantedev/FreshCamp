import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Configuration de base d'axios
axios.defaults.withCredentials = true; // Important pour les cookies de session

// Intercepteur pour ajouter le token à chaque requête
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service pour les campements
export const campgroundService = {
  // Récupérer tous les campements
  getAllCampgrounds: async () => {
    try {
      const response = await axios.get(`${API_URL}/campgrounds`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Récupérer un campement par son ID
  getCampgroundById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/campgrounds/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Créer un nouveau campement
  createCampground: async (campgroundData) => {
    try {
      // Pour gérer les fichiers image, nous devons utiliser FormData
      const formData = new FormData();
      
      // Ajouter les données du campement
      Object.keys(campgroundData).forEach(key => {
        if (key === 'image') {
          // Si des fichiers image sont fournis, les ajouter séparément
          if (campgroundData.image) {
            for (let i = 0; i < campgroundData.image.length; i++) {
              formData.append('image', campgroundData.image[i]);
            }
          }
        } else {
          formData.append(key, campgroundData[key]);
        }
      });
      
      const response = await axios.post(`${API_URL}/campgrounds`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Mettre à jour un campement
  updateCampground: async (id, campgroundData) => {
    try {
      // Utiliser FormData pour gérer les fichiers
      const formData = new FormData();
      
      Object.keys(campgroundData).forEach(key => {
        if (key === 'image') {
          if (campgroundData.image) {
            for (let i = 0; i < campgroundData.image.length; i++) {
              formData.append('image', campgroundData.image[i]);
            }
          }
        } else if (key === 'deleteImages') {
          // Pour les images à supprimer
          if (campgroundData.deleteImages && campgroundData.deleteImages.length) {
            campgroundData.deleteImages.forEach(filename => {
              formData.append('deleteImages[]', filename);
            });
          }
        } else {
          formData.append(key, campgroundData[key]);
        }
      });
      
      const response = await axios.put(`${API_URL}/campgrounds/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Supprimer un campement
  deleteCampground: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/campgrounds/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Service pour les avis
export const reviewService = {
  // Ajouter un avis à un campement
  addReview: async (campgroundId, reviewData) => {
    try {
      const response = await axios.post(`${API_URL}/campgrounds/${campgroundId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Supprimer un avis
  deleteReview: async (campgroundId, reviewId) => {
    try {
      const response = await axios.delete(`${API_URL}/campgrounds/${campgroundId}/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
