
import React, { useState, useEffect } from 'react';
import { MOCK_STUDENTS } from '../constants';
import { generateStudentReport } from '../services/geminiService';
import { Student } from '../types';

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('edupulse_students');
    try {
      return saved ? JSON.parse(saved) : MOCK_STUDENTS;
    } catch (e) {
      return MOCK_STUDENTS;
    }
  });
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [newStudent, setNewStudent] = useState({
    name: '',
    grade: '9th',
    email: '',
    subjects: ''
  });

  useEffect(() => {
    localStorage.setItem('edupulse_students', JSON.stringify(students));
  }, [students]);

  const handleGenerateReport = async (student: Student) => {
    setSelectedStudent(student);
    setIsLoading(true);
    setReport(null);
    const context = `GPA: ${student.gpa}, Attendance: ${student.attendance}%, Subjects: ${student.subjects.join(', ')}`;
    const result = await generateStudentReport(student.name, context);
    setReport(result || "Failed to generate report.");
    setIsLoading(false);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const studentToAdd: Student = {
      id: `s-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: newStudent.name,
      grade: newStudent.grade,
      email: newStudent.email || `${newStudent.name.toLowerCase().replace(/\s+/g, '.')}@school.edu`,
      attendance: 100,
      gpa: 4.0,
      subjects: newStudent.subjects.split(',').map(s => s.trim()).filter(s => s !== '')
    };
    
    setStudents(prev => [studentToAdd, ...prev]);
    setIsAddModalOpen(false);
    setNewStudent({ name: '', grade: '9th', email: '', subjects: '' });
  };

  const handleDeleteStudent = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirmingDeleteId === id) {
      setStudents(prev => prev.filter(s => s.id !== id));
      setConfirmingDeleteId(null);
    } else {
      setConfirmingDeleteId(id);
      // Auto-reset confirmation after 3 seconds
      setTimeout(() => setConfirmingDeleteId(current => current === id ? null : current), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Students Directory</h2>
          <p className="text-slate-500 text-sm">Manage student enrollment and academic summaries</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <span>+</span> Add New Student
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Name & Subjects</th>
                <th className="px-6 py-4">Grade</th>
                <th className="px-6 py-4">Attendance</th>
                <th className="px-6 py-4">GPA</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic font-medium">
                    No student records found.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{student.name}</div>
                      <div className="text-xs text-slate-500">{student.subjects.join(', ')}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{student.grade}</td>
                    <td className="px-6 py-4">
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full bg-green-500`} style={{ width: `${student.attendance}%` }}></div>
                      </div>
                      <span className="text-xs text-slate-500 mt-1 block">{student.attendance}%</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-indigo-600">{student.gpa}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{student.email}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleGenerateReport(student)} 
                          className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                        >
                          ✨ Report
                        </button>
                        <button 
                          onClick={(e) => handleDeleteStudent(e, student.id)} 
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            confirmingDeleteId === student.id 
                            ? 'bg-red-600 text-white animate-pulse' 
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {confirmingDeleteId === student.id ? 'Confirm?' : '🗑️ Remove'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b bg-indigo-600 text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">Register New Student</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white hover:text-white/80">✕</button>
            </div>
            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
                <input required type="text" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="e.g. John Doe" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Grade</label>
                  <select value={newStudent.grade} onChange={e => setNewStudent({...newStudent, grade: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none">
                    <option>9th</option><option>10th</option><option>11th</option><option>12th</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                  <input type="email" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none" placeholder="Optional" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Subjects (comma separated)</label>
                <input type="text" value={newStudent.subjects} onChange={e => setNewStudent({...newStudent, subjects: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none" placeholder="Math, Science, Art" />
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors mt-2">
                Save Student Record
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">AI Performance Report: {selectedStudent.name}</h3>
              <button onClick={() => setSelectedStudent(null)} className="text-white hover:text-white/80">✕</button>
            </div>
            <div className="p-8 overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                  <p className="text-slate-500 font-medium">Gemini is analyzing student data...</p>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100 text-slate-800 whitespace-pre-line leading-relaxed">
                    {report}
                  </div>
                  <button 
                    onClick={() => setSelectedStudent(null)}
                    className="mt-6 w-full py-2 bg-slate-900 text-white rounded-lg font-bold"
                  >
                    Dismiss Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
