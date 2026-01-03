
import React, { useState, useEffect } from 'react';
import { MOCK_TEACHERS } from '../constants';
import { Teacher } from '../types';

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('edupulse_teachers');
    try {
      return saved ? JSON.parse(saved) : MOCK_TEACHERS;
    } catch (e) {
      return MOCK_TEACHERS;
    }
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messagingTeacher, setMessagingTeacher] = useState<Teacher | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    subject: 'Mathematics',
    email: '',
    experience: 1
  });

  useEffect(() => {
    localStorage.setItem('edupulse_teachers', JSON.stringify(teachers));
  }, [teachers]);

  const handleHireTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const teacherToAdd: Teacher = { 
      id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, 
      ...newTeacher 
    };
    setTeachers(prev => [teacherToAdd, ...prev]);
    setIsModalOpen(false);
    setNewTeacher({ name: '', subject: 'Mathematics', email: '', experience: 1 });
  };

  const handleDeleteTeacher = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirmingDeleteId === id) {
      setTeachers(prev => prev.filter(t => t.id !== id));
      setConfirmingDeleteId(null);
    } else {
      setConfirmingDeleteId(id);
      setTimeout(() => setConfirmingDeleteId(curr => curr === id ? null : curr), 3000);
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setMessagingTeacher(null);
      setMessageText('');
      alert('Your message has been delivered to ' + messagingTeacher?.name);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Faculty Directory</h2>
          <p className="text-slate-500 text-sm">Manage staff records, assignments, and experience</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Hire New Teacher
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Instructor</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Experience</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic">No faculty members found.</td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
                          {teacher.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900">{teacher.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                        {teacher.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{teacher.experience} Years</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{teacher.email}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setMessagingTeacher(teacher)}
                          className="text-slate-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                          title="Send Message"
                        >
                          ✉️
                        </button>
                        <button 
                          onClick={(e) => handleDeleteTeacher(e, teacher.id)} 
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            confirmingDeleteId === teacher.id 
                            ? 'bg-red-600 text-white animate-pulse' 
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {confirmingDeleteId === teacher.id ? 'Confirm?' : '🗑️ Remove'}
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

      {messagingTeacher && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold">Contact {messagingTeacher.name}</h3>
              <button onClick={() => setMessagingTeacher(null)}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Your Message</div>
              <textarea 
                rows={4} 
                className="w-full p-3 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm" 
                placeholder="Write your email content..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <div className="flex gap-3 pt-2">
                 <button 
                  onClick={() => setMessagingTeacher(null)}
                  className="flex-1 py-2 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSendMessage}
                  disabled={isSending || !messageText.trim()}
                  className="flex-[2] py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-100 disabled:opacity-50 hover:bg-indigo-700 transition-all"
                >
                  {isSending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in zoom-in-95">
            <h3 className="text-lg font-bold mb-4 text-slate-900">Add Staff Member</h3>
            <form onSubmit={handleHireTeacher} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                <input required type="text" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="e.g. Robert Ford" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Department</label>
                  <select value={newTeacher.subject} onChange={e => setNewTeacher({...newTeacher, subject: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none">
                    <option>Mathematics</option><option>Science</option><option>History</option><option>Arts</option><option>Physical Ed</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Experience</label>
                  <input required type="number" min="0" value={newTeacher.experience} onChange={e => setNewTeacher({...newTeacher, experience: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                <input required type="email" value={newTeacher.email} onChange={e => setNewTeacher({...newTeacher, email: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none" placeholder="faculty@school.edu" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-500 font-bold rounded-lg hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors">Confirm Hire</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
