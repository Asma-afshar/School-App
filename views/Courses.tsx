
import React, { useState, useEffect } from 'react';
import { MOCK_COURSES } from '../constants';
import { Course } from '../types';
import { generateSyllabus } from '../services/geminiService';

const categoryColors = {
  Science: 'bg-blue-100 text-blue-700',
  Mathematics: 'bg-purple-100 text-purple-700',
  Humanities: 'bg-orange-100 text-orange-700',
  Arts: 'bg-pink-100 text-pink-700',
  'Physical Ed': 'bg-green-100 text-green-700',
};

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('edupulse_courses');
    try {
      return saved ? JSON.parse(saved) : MOCK_COURSES;
    } catch (e) {
      return MOCK_COURSES;
    }
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [syllabus, setSyllabus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [newCourse, setNewCourse] = useState({
    title: '',
    code: '',
    category: 'Science' as Course['category'],
    credits: 3,
    teacher: '',
    description: ''
  });

  useEffect(() => {
    localStorage.setItem('edupulse_courses', JSON.stringify(courses));
  }, [courses]);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const courseToAdd: Course = { 
      id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, 
      ...newCourse 
    };
    setCourses(prev => [courseToAdd, ...prev]);
    setIsModalOpen(false);
    setNewCourse({
      title: '',
      code: '',
      category: 'Science',
      credits: 3,
      teacher: '',
      description: ''
    });
  };

  const handleViewSyllabus = async (course: Course) => {
    setSelectedCourse(course);
    setIsLoading(true);
    setSyllabus(null);
    const result = await generateSyllabus(course.title, course.description);
    setSyllabus(result);
    setIsLoading(false);
  };

  const handleDeleteCourse = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirmingDeleteId === id) {
      setCourses(prev => prev.filter(c => c.id !== id));
      setConfirmingDeleteId(null);
    } else {
      setConfirmingDeleteId(id);
      setTimeout(() => setConfirmingDeleteId(curr => curr === id ? null : curr), 3000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Course Catalog</h2>
          <p className="text-slate-500">Explore and manage available academic programs</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          + Add New Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white p-20 rounded-2xl border border-dashed border-slate-300 text-center text-slate-400">
          <p className="text-lg">The catalog is currently empty.</p>
          <button onClick={() => setIsModalOpen(true)} className="text-indigo-600 font-bold hover:underline mt-2">Click here to create the first course</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
              <div className="h-2 bg-indigo-500"></div>
              <div className="p-6 flex-1">
                <div className="flex justify-between mb-4">
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${categoryColors[course.category] || 'bg-slate-100 text-slate-600'}`}>
                    {course.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{course.code}</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                <p className="text-sm text-slate-500 mb-6 line-clamp-2">{course.description || 'No description available for this course.'}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                  <span className="text-sm text-slate-500 font-medium">{course.credits} Credits</span>
                  <button 
                    onClick={() => handleViewSyllabus(course)} 
                    className="text-indigo-600 text-sm font-bold hover:underline"
                  >
                    ✨ View Syllabus
                  </button>
                </div>
              </div>
              <div className="px-6 py-3 bg-slate-50/50 flex justify-end border-t border-slate-100">
                <button 
                  onClick={(e) => handleDeleteCourse(e, course.id)} 
                  className={`text-xs font-bold uppercase tracking-wider transition-all p-2 rounded-lg ${
                    confirmingDeleteId === course.id 
                    ? 'bg-red-600 text-white' 
                    : 'text-red-400 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  {confirmingDeleteId === course.id ? 'Click to Confirm Removal' : '🗑️ Remove Course'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95">
            <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">AI Course Syllabus</h3>
                <p className="text-xs text-white/70">{selectedCourse.title} ({selectedCourse.code})</p>
              </div>
              <button onClick={() => setSelectedCourse(null)} className="text-white hover:text-white/80 text-xl font-bold">✕</button>
            </div>
            <div className="p-8 overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                  <p className="text-slate-500 font-medium">Gemini is designing your curriculum...</p>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 whitespace-pre-line text-slate-800 leading-relaxed text-sm">
                    {syllabus}
                  </div>
                  <button 
                    onClick={() => setSelectedCourse(null)}
                    className="mt-6 w-full py-2 bg-slate-900 text-white rounded-lg font-bold"
                  >
                    Close Syllabus
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 animate-in zoom-in-95">
            <h3 className="text-lg font-bold mb-4 text-slate-900">Create New Course</h3>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Title</label>
                <input required type="text" placeholder="e.g. Modern Physics" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Code</label>
                  <input required type="text" placeholder="PHY101" value={newCourse.code} onChange={e => setNewCourse({...newCourse, code: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Credits</label>
                  <input required type="number" value={newCourse.credits} onChange={e => setNewCourse({...newCourse, credits: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                <select value={newCourse.category} onChange={e => setNewCourse({...newCourse, category: e.target.value as Course['category']})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none">
                  <option>Science</option><option>Mathematics</option><option>Humanities</option><option>Arts</option><option>Physical Ed</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                <textarea rows={3} placeholder="Briefly describe the course goals..." value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none resize-none" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-lg">Discard</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors">Publish Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
