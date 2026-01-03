
import React, { useState } from 'react';
import { MOCK_STUDENTS } from '../constants';
import { Student } from '../types';

const AdmissionForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: '',
    grade: '',
    guardianName: '',
    relationship: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Get current students
    const saved = localStorage.getItem('edupulse_students');
    const students: Student[] = saved ? JSON.parse(saved) : MOCK_STUDENTS;
    
    // 2. Create new student object
    const newStudent: Student = {
      id: `s-${Date.now()}`,
      name: formData.name,
      grade: formData.grade.split(' ')[0] || '9th',
      email: formData.email || `${formData.name.toLowerCase().replace(' ', '.')}@school.edu`,
      attendance: 100,
      gpa: 4.0,
      subjects: ['Orientation']
    };
    
    // 3. Save back to storage
    localStorage.setItem('edupulse_students', JSON.stringify([newStudent, ...students]));
    
    setSubmitted(true);
    setFormData({ name: '', dob: '', email: '', grade: '', guardianName: '', relationship: '', phone: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  if (submitted) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
        <p className="text-slate-500 mb-8">Student record has been created. The admission office will review the profile shortly.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-xl font-bold text-slate-900">Student Admission Form</h3>
        <p className="text-slate-500 text-sm mt-1">Please fill in all required fields to register a new student.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div>
          <h4 className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">
            1. Student Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Full Name *</label>
              <input 
                required 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none" 
                placeholder="Enter full name" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Date of Birth *</label>
              <input 
                required 
                type="date" 
                value={formData.dob}
                onChange={e => setFormData({...formData, dob: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none" 
                placeholder="student@school.edu" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Grade Level *</label>
              <select 
                required 
                value={formData.grade}
                onChange={e => setFormData({...formData, grade: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
              >
                <option value="">Select Grade</option>
                <option>9th Grade</option>
                <option>10th Grade</option>
                <option>11th Grade</option>
                <option>12th Grade</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">
            2. Parent/Guardian Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Guardian Name *</label>
              <input 
                required 
                type="text" 
                value={formData.guardianName}
                onChange={e => setFormData({...formData, guardianName: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none" 
                placeholder="Enter guardian name" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Relationship *</label>
              <input 
                required 
                type="text" 
                value={formData.relationship}
                onChange={e => setFormData({...formData, relationship: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none" 
                placeholder="e.g. Mother, Father" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Phone Number *</label>
              <input 
                required 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none" 
                placeholder="+1 (555) 000-0000" 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button 
            type="submit"
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
          >
            Submit Application 🚀
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdmissionForm;
