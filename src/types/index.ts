// User interface
export interface User 
{
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
}

// JWT Payload interface 
export interface JwtPayload 
{
  exp: number;  // Expiry timestamp 
  iat: number;  // Issued at timestamp 
  id?: number;  // User ID 
}

// Course interface
export interface Course 
{
  id: number | string;
  title: string;
  category: string;
  level: string;
  description: string;
  thumbnail: string;
}

// Course filter interface
export interface CourseFilter 
{
  title?: string;
  category?: string;
  level?: string;
}
