import { COUNTRIES } from '../constants';

// ===================== TIME =====================
export const formatTime = (minutes) => {
  if (!minutes || minutes === 0) return '—';
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hrs}h ${mins}m` : `${hrs}h`;
};

// ===================== DATE =====================
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return formatDate(date);
};

// ===================== TEXT =====================
export const truncate = (str, len = 100) => {
  if (!str || str.length <= len) return str;
  return str.substring(0, len).trimEnd() + '…';
};

export const generateInitials = (firstName, lastName) => {
  return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase();
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// ===================== DIFFICULTY =====================
export const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30',
    medium: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30',
    hard: 'text-orange-600 bg-orange-50 dark:bg-orange-900/30',
    expert: 'text-red-600 bg-red-50 dark:bg-red-900/30',
  };
  return colors[difficulty] || colors.medium;
};

export const getDifficultyIcon = (difficulty) => {
  const icons = { easy: '🟢', medium: '🟡', hard: '🟠', expert: '🔴' };
  return icons[difficulty] || icons.medium;
};

// ===================== IMAGES =====================
export const getImageUrl = (url, fallback = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600') => {
  if (!url || url === '') return fallback;
  return url;
};

export const getRecipeImageUrl = (recipe, size = 600) => {
  if (recipe?.coverImage) return recipe.coverImage;
  // Generate a deterministic fallback based on recipe title
  const hash = (recipe?.title || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const foodImages = [
    'photo-1546069901-ba9599a7e63c',
    'photo-1504674900247-0877df9cc836',
    'photo-1567620905732-2d1ec7ab7445',
    'photo-1565299507177-b0ac66763828',
    'photo-1512621776951-a57141f2eefd',
  ];
  return `https://images.unsplash.com/${foodImages[hash % foodImages.length]}?w=${size}`;
};

// ===================== COUNTRY =====================
export const getCountryFlag = (countryName) => {
  if (!countryName) return '🌍';
  const country = COUNTRIES.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase()
  );
  return country?.flag || '🌍';
};

export const getCountryData = (countryName) => {
  if (!countryName) return null;
  return COUNTRIES.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase()
  );
};

// ===================== RATING =====================
export const formatRating = (rating) => {
  if (!rating || rating === 0) return 'New';
  return rating.toFixed(1);
};

export const getStarCount = (rating) => {
  return Math.round(rating || 0);
};

// ===================== NUTRITION =====================
export const formatNutrition = (value, unit = 'g') => {
  if (!value || value === 0) return '—';
  return `${Math.round(value)}${unit}`;
};

export const getCalorieColor = (calories) => {
  if (calories <= 200) return 'text-emerald-600';
  if (calories <= 400) return 'text-amber-600';
  if (calories <= 600) return 'text-orange-600';
  return 'text-red-600';
};

// ===================== SERVINGS =====================
export const adjustIngredientQuantity = (ingredient, originalServings, newServings) => {
  const multiplier = newServings / originalServings;
  return {
    ...ingredient,
    amount: ingredient.amount ? Math.round(ingredient.amount * multiplier * 10) / 10 : null,
  };
};

// ===================== UTILITIES =====================
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const debounce = (fn, ms = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
};
