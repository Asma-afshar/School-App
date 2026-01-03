
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  attendance: number;
  gpa: number;
  email: string;
  subjects: string[];
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  experience: number;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  category: 'Science' | 'Arts' | 'Mathematics' | 'Humanities' | 'Physical Ed';
  teacher: string;
  description: string;
  credits: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  desc: string;
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late';
}

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  avgAttendance: number;
  upcomingEvents: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
