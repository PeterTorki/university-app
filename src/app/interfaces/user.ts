export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  isConfirmed: boolean;
  department?: string;
  enrolledCourses?: string[];
}
