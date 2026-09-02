import api from '../api/axios';

export const recipeService = {
  getRecipes: (params) => api.get('/recipes', { params }),
  getRecipeById: (id) => api.get(`/recipes/${id}`),
  getTrending: () => api.get('/recipes/trending'),
  getFeatured: () => api.get('/recipes/featured'),
  search: (params) => api.get('/recipes/search', { params }),
  getMyRecipes: (params) => api.get('/recipes/my-recipes', { params }),
  createRecipe: (data) => api.post('/recipes', data),
  updateRecipe: (id, data) => api.patch(`/recipes/${id}`, data),
  deleteRecipe: (id) => api.delete(`/recipes/${id}`),
  toggleFavorite: (id) => api.post(`/recipes/${id}/favorite`),
  checkFavorite: (id) => api.get(`/recipes/${id}/favorite/check`),
  getFavorites: (params) => api.get('/recipes/favorites', { params }),
  getReviews: (id, params) => api.get(`/recipes/${id}/reviews`, { params }),
  createReview: (id, data) => api.post(`/recipes/${id}/reviews`, data),
};

export const userService = {
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getUserById: (id) => api.get(`/users/${id}`),
  followUser: (id) => api.post(`/auth/follow/${id}`),
  getUsers: (params) => api.get('/users', { params }),
  getAdminStats: () => api.get('/users/admin/stats'),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const categoryService = {
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.patch(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export const reviewService = {
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export const mealPlanService = {
  getPlan: (params) => api.get('/meal-planner', { params }),
  addMeal: (data) => api.post('/meal-planner', data),
  removeMeal: (day, mealId, weekStart) => api.delete(`/meal-planner/${day}/${mealId}?weekStart=${weekStart}`),
  updatePlan: (id, data) => api.patch(`/meal-planner/${id}`, data),
  deletePlan: (id) => api.delete(`/meal-planner/${id}`),
};

export const newsletterService = {
  subscribe: (email) => api.post('/newsletter/subscribe', { email }),
  unsubscribe: (email) => api.post('/newsletter/unsubscribe', { email }),
};
