import type { Course, CourseFilter } from '../types';

const API_BASE_URL = import.meta.env.VITE_COURSE_API_URL;

// READ - Get all courses with pagination & filter
export const getCourses = async (
  page: number,
  pageSize: number,
  filters?: CourseFilter
): Promise<{ data: Course[]; total: number }> => {
  try {
    // Build query params
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', pageSize.toString());
    
    if (filters?.title) {
      params.append('search', filters.title);
    }
    if (filters?.category) {
      params.append('category', filters.category);
    }
    if (filters?.level) {
      params.append('level', filters.level);
    }

    const response = await fetch(`${API_BASE_URL}/course?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }

    const data: Course[] = await response.json();
    
    // MockAPI doesn't return total count, so we need to fetch all to get total
    const totalResponse = await fetch(`${API_BASE_URL}/course`);
    const allData: Course[] = await totalResponse.json();
    
    // Apply client-side filtering for category and level if API doesn't support it
    let filteredTotal = allData;
    if (filters?.title) {
      filteredTotal = filteredTotal.filter(c => 
        c.title.toLowerCase().includes(filters.title!.toLowerCase())
      );
    }
    if (filters?.category) {
      filteredTotal = filteredTotal.filter(c => c.category === filters.category);
    }
    if (filters?.level) {
      filteredTotal = filteredTotal.filter(c => c.level === filters.level);
    }

    return {
      data: data,
      total: filteredTotal.length
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    return { data: [], total: 0 };
  }
};

// READ - Get course by ID
export const getCourseById = async (id: number | string): Promise<Course | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/course/${id}`);
    
    if (!response.ok) {
      throw new Error('Course not found');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching course:', error);
    return undefined;
  }
};

// CREATE - Add new course
export const createCourse = async (course: Omit<Course, 'id'>): Promise<Course> => {
  const response = await fetch(`${API_BASE_URL}/course`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    throw new Error('Failed to create course');
  }

  return await response.json();
};

// UPDATE - Update existing course
export const updateCourse = async (course: Course): Promise<Course> => {
  const response = await fetch(`${API_BASE_URL}/course/${course.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    throw new Error('Failed to update course');
  }

  return await response.json();
};

// DELETE - Remove course
export const deleteCourse = async (id: number | string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/course/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete course');
  }
};
