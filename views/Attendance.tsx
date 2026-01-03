
import React, { useState } from 'react';
import { MOCK_STUDENTS } from '../constants';
import { AttendanceRecord } from '../types';

const Attendance: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>(
    MOCK_STUDENTS.map(s => ({ studentId: s.id, studentName: s.name, status: 'present' }))
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleStatus = (studentId: string) => {
    setRecords(records.map(r => 
      r.studentId === studentId 
        ? { ...r, status: r.status === 'present' ? 'absent' : 'present' } 
        : r
    ));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  const presentCount = records.filter(r => r.status === 'present').length;
  const attendancePercentage = Math.round((presentCount / records.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Attendance Register</h2>
          <p className="text-slate-500 text-sm">Mark daily attendance for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 px-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-center border-r border-slate-100 pr-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Total</p>
            <p className="text-lg font-bold text-slate-900">{records.length}</p>
          </div>
          <div className="text-center pr-4 border-r border-slate-100">
            <p className="text-[10px] text-green-500 font-bold uppercase">Present</p>
            <p className="text-lg font-bold text-green-600">{presentCount}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-indigo-500 font-bold uppercase">Rate</p>
            <p className="text-lg font-bold text-indigo-600">{attendancePercentage}%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <span className="text-sm font-semibold text-slate-600">Student List</span>
          <div className="flex gap-2">
             <button onClick={() => setRecords(records.map(r => ({...r, status: 'present'})))} className="text-xs text-indigo-600 font-medium hover:underline">Mark All Present</button>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {records.map((record) => (
            <div key={record.studentId} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${record.status === 'present' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium text-slate-800">{record.studentName}</span>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => toggleStatus(record.studentId)}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                    record.status === 'present' 
                    ? 'bg-white text-green-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  PRESENT
                </button>
                <button 
                  onClick={() => toggleStatus(record.studentId)}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                    record.status === 'absent' 
                    ? 'bg-white text-red-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  ABSENT
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
            showSuccess 
            ? 'bg-green-500 text-white shadow-green-100' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
          }`}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Processing...
            </>
          ) : showSuccess ? (
            <>
              <span>✓</span> Saved Successfully
            </>
          ) : (
            'Finalize Today\'s Attendance'
          )}
        </button>
      </div>
    </div>
  );
};

export default Attendance;
