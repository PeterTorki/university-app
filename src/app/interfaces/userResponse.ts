export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  isConfirmed: boolean;
  department?: {
    _id: string;
    name: string;
  };
  enrolledCourses?: any[];
  createdAt?: string;
  updatedAt?: string;
}
