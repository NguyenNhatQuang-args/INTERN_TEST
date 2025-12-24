// API Configuration 
export const API_CONFIG = {
  COURSE_API_URL: import.meta.env.VITE_COURSE_API_URL,
  AUTH_API_URL: import.meta.env.VITE_AUTH_API_URL,
} as const;

// Cookie Keys
export const COOKIE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
} as const;

// Cookie Options
export const COOKIE_OPTIONS = {
  secure: import.meta.env.PROD, // Chỉ secure trên production (HTTPS)
  sameSite: 'strict' as const,  // Chống CSRF
  expires: 7,                    // 7 ngày cho refresh token
} as const;

// Token Expiry (in days)
export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: 1 / 48,  // 30 phút
  REFRESH_TOKEN: 7,       // 7 ngày
} as const;

//  Storage Keys (deprecated - use COOKIE_KEYS instead)
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
} as const;

//  Course Categories
export const COURSE_CATEGORIES = [
  { value: 'SPEAKING', label: 'SPEAKING' },
  { value: 'VOCABULARY', label: 'VOCABULARY' },
  { value: 'GRAMMAR', label: 'GRAMMAR' },
  { value: '4SKILLS', label: '4 Skills' },
  { value: 'WRITING', label: 'WRITING' },
] as const;

//  Course Levels 
export const COURSE_LEVELS = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Total Comprehension', label: 'Total Comprehension' },
  { value: 'Elementary', label: 'Elementary' },
  { value: 'Upper Intermediate', label: 'Upper Intermediate' },
] as const;

//  Level Colors 
export const LEVEL_COLORS: Record<string, string> = {
  Beginner: 'green',
  Intermediate: 'orange',
  Advanced: 'red',
  'Total Comprehension': 'gray',
  Elementary: 'gray',
  'Upper Intermediate': 'gray',
};

//  Pagination 
export const PAGINATION: { DEFAULT_PAGE: number; DEFAULT_PAGE_SIZE: number } = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
};

//  Default Values 
export const DEFAULTS = {
  THUMBNAIL_URL: 'https://dummyjson.com/image/150',
  LOGO_URL: 'https://jaxtina.com/wp-content/themes/jax2024/img/logo.svg',
} as const;

//  Routes 
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  COURSES: '/courses',
  COURSE_ADD: '/courses/add',
  COURSE_EDIT: '/courses/edit/:id',
} as const;

//  Messages 
export const MESSAGES = {
  SUCCESS: {
    COURSE_CREATED: 'Course created successfully',
    COURSE_UPDATED: 'Course updated successfully',
    COURSE_DELETED: 'Course deleted successfully',
  },
  ERROR: {
    FETCH_COURSES: 'Failed to fetch courses',
    FETCH_COURSE: 'Failed to load course',
    CREATE_COURSE: 'Failed to create course',
    UPDATE_COURSE: 'Failed to update course',
    DELETE_COURSE: 'Failed to delete course',
    COURSE_NOT_FOUND: 'Course not found',
    INVALID_CREDENTIALS: 'Invalid credentials',
  },
} as const;
