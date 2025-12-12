export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
}

export interface Course {
  id: number | string;
  title: string;
  category: string;
  level: string;
  description: string;
  thumbnail: string;
}

export interface CourseFilter {
  title?: string;
  category?: string;
  level?: string;
}
