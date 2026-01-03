
import { Student, Teacher, SchoolStats, Course } from './types';

export const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Alice Johnson', grade: '10th', attendance: 95, gpa: 3.8, email: 'alice@school.edu', subjects: ['Math', 'Physics', 'History'] },
  { id: '2', name: 'Bob Smith', grade: '11th', attendance: 88, gpa: 3.2, email: 'bob@school.edu', subjects: ['English', 'Biology', 'Art'] },
  { id: '3', name: 'Charlie Davis', grade: '10th', attendance: 92, gpa: 3.5, email: 'charlie@school.edu', subjects: ['Chemistry', 'Math', 'Spanish'] },
  { id: '4', name: 'Diana Prince', grade: '12th', attendance: 98, gpa: 4.0, email: 'diana@school.edu', subjects: ['History', 'Economics', 'CompSci'] },
  { id: '5', name: 'Ethan Hunt', grade: '9th', attendance: 85, gpa: 2.9, email: 'ethan@school.edu', subjects: ['Math', 'Gym', 'Art'] },
];

export const MOCK_TEACHERS: Teacher[] = [
  { id: 't1', name: 'Dr. Sarah Wilson', subject: 'Mathematics', email: 'wilson@school.edu', experience: 12 },
  { id: 't2', name: 'Mr. James Miller', subject: 'History', email: 'miller@school.edu', experience: 8 },
  { id: 't3', name: 'Ms. Emily Chen', subject: 'Science', email: 'chen@school.edu', experience: 5 },
];

export const MOCK_COURSES: Course[] = [
  { id: 'c1', title: 'Advanced Physics', code: 'PHY301', category: 'Science', teacher: 'Dr. Sarah Wilson', credits: 4, description: 'Explore the fundamentals of mechanics, electromagnetism, and modern physics.' },
  { id: 'c2', title: 'Calculus II', code: 'MAT202', category: 'Mathematics', teacher: 'Mr. James Miller', credits: 4, description: 'In-depth study of integration techniques, sequences, series, and power series.' },
  { id: 'c3', title: 'World History', code: 'HIS105', category: 'Humanities', teacher: 'Ms. Emily Chen', credits: 3, description: 'A journey through major global civilizations from ancient times to the modern era.' },
  { id: 'c4', title: 'Modern Arts', code: 'ART110', category: 'Arts', teacher: 'Ms. Emily Chen', credits: 2, description: 'Practical introduction to contemporary painting, sculpture, and digital media.' },
  { id: 'c5', title: 'Biology Foundations', code: 'BIO101', category: 'Science', teacher: 'Dr. Sarah Wilson', credits: 3, description: 'Introduction to cellular biology, genetics, and ecology principles.' },
];

export const INITIAL_STATS: SchoolStats = {
  totalStudents: 1250,
  totalTeachers: 85,
  avgAttendance: 94,
  upcomingEvents: 4
};
