export interface Course {
  _id: string;
  title: string;
  description?: string;
  department: {
    _id: string;
    name: string;
  };
  students?: any[];
  createdAt?: string;
  updatedAt?: string;
}
