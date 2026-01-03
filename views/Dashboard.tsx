
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import DashboardCard from '../components/DashboardCard';
import { MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES } from '../constants';
import { Event } from '../types';

const attendanceData = [
  { name: 'Mon', attendance: 92 },
  { name: 'Tue', attendance: 95 },
  { name: 'Wed', attendance: 94 },
  { name: 'Thu', attendance: 88 },
  { name: 'Fri', attendance: 91 },
];

const gradeData = [
  { grade: 'A', count: 450 },
  { grade: 'B', count: 580 },
  { grade: 'C', count: 180 },
  { grade: 'D', count: 40 },
];

const DEFAULT_EVENTS: Event[] = [
  { id: 'ev-1', title: 'Annual Sports Meet', date: 'Oct 15, 2023', time: '09:00 AM', location: 'Main Stadium', desc: 'Celebrate athletic excellence with our yearly inter-house competitions.' },
  { id: 'ev-2', title: 'Parent-Teacher Meeting', date: 'Oct 20, 2023', time: '02:00 PM', location: 'Hall A', desc: 'Review student progress and academic goals for the upcoming term.' },
  { id: 'ev-3', title: 'Science Fair', date: 'Oct 25, 2023', time: '10:30 AM', location: 'Science Lab', desc: 'Innovative projects displayed by our students from grades 9 to 12.' },
];

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('edupulse_events');
    try {
      return saved ? JSON.parse(saved) : DEFAULT_EVENTS;
    } catch (e) {
      return DEFAULT_EVENTS;
    }
  });

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isAllEventsOpen, setIsAllEventsOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [isAddingToCalendar, setIsAddingToCalendar] = useState<string | null>(null);
  const [counts, setCounts] = useState({ students: 0, teachers: 0, courses: 0 });

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    desc: ''
  });

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('edupulse_students') || JSON.stringify(MOCK_STUDENTS));
    const t = JSON.parse(localStorage.getItem('edupulse_teachers') || JSON.stringify(MOCK_TEACHERS));
    const c = JSON.parse(localStorage.getItem('edupulse_courses') || JSON.stringify(MOCK_COURSES));
    
    setCounts({
      students: s.length,
      teachers: t.length,
      courses: c.length
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('edupulse_events', JSON.stringify(events));
  }, [events]);

  const formatDateForDisplay = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const eventToAdd: Event = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      ...newEvent,
      date: formatDateForDisplay(newEvent.date)
    };
    setEvents(prev => [eventToAdd, ...prev]);
    setIsAddEventOpen(false);
    setNewEvent({ title: '', date: '', time: '', location: '', desc: '' });
  };

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    const updatedEvent = {
      ...editingEvent,
      // Ensure the date is formatted if it was changed in a date picker
      date: editingEvent.date.includes('-') ? formatDateForDisplay(editingEvent.date) : editingEvent.date
    };

    setEvents(prev => prev.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev));
    setEditingEvent(null);
  };

  const handleRemoveEvent = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirmingDeleteId === id) {
      setEvents(prev => prev.filter(ev => ev.id !== id));
      setConfirmingDeleteId(null);
      if (selectedEvent?.id === id) setSelectedEvent(null);
    } else {
      setConfirmingDeleteId(id);
      setTimeout(() => setConfirmingDeleteId(curr => curr === id ? null : curr), 3000);
    }
  };

  const handleAddToCalendar = (eventId: string) => {
    setIsAddingToCalendar(eventId);
    setTimeout(() => {
      setIsAddingToCalendar(null);
      alert('Event added to your calendar successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Students" value={counts.students} icon="👥" trend="+2.5%" trendUp={true} />
        <DashboardCard title="Faculty Members" value={counts.teachers} icon="🧑‍🏫" />
        <DashboardCard title="Active Courses" value={counts.courses} icon="📚" />
        <DashboardCard title="Upcoming Events" value={events.length} icon="📅" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Weekly Attendance Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Grade Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="grade" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#a5b4fc" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Scheduled Events</h3>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsAddEventOpen(true)}
              className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
            >
              + Create Event
            </button>
            <button 
              onClick={() => setIsAllEventsOpen(true)}
              className="text-indigo-600 text-sm font-bold hover:underline"
            >
              View All
            </button>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {events.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-400 italic text-sm">No upcoming events scheduled.</div>
          ) : (
            events.slice(0, 3).map((event) => (
              <div key={event.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{event.title}</p>
                  <p className="text-xs text-slate-500 font-medium">{event.date} • {event.time}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => setSelectedEvent(event)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-white hover:border-slate-300 transition-all"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => setEditingEvent(event)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => handleRemoveEvent(e, event.id)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      confirmingDeleteId === event.id 
                      ? 'bg-red-600 text-white' 
                      : 'text-red-400 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    {confirmingDeleteId === event.id ? 'Confirm?' : 'Remove'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {(isAddEventOpen || editingEvent) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {editingEvent ? 'Edit Event Details' : 'Create New Event'}
              </h3>
              <button 
                onClick={() => { setIsAddEventOpen(false); setEditingEvent(null); }}
                className="text-slate-400 hover:text-slate-600"
              >✕</button>
            </div>
            <form onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Event Title</label>
                <input 
                  required 
                  type="text" 
                  value={editingEvent ? editingEvent.title : newEvent.title} 
                  onChange={e => editingEvent ? setEditingEvent({...editingEvent, title: e.target.value}) : setNewEvent({...newEvent, title: e.target.value})} 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20" 
                  placeholder="e.g. Science Fair" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Date</label>
                  <input 
                    required 
                    type={editingEvent && !editingEvent.date.includes('-') ? "text" : "date"} 
                    value={editingEvent ? editingEvent.date : newEvent.date} 
                    onFocus={(e) => editingEvent && (e.target.type = 'date')}
                    onChange={e => editingEvent ? setEditingEvent({...editingEvent, date: e.target.value}) : setNewEvent({...newEvent, date: e.target.value})} 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Time</label>
                  <input 
                    required 
                    type="text" 
                    value={editingEvent ? editingEvent.time : newEvent.time} 
                    onChange={e => editingEvent ? setEditingEvent({...editingEvent, time: e.target.value}) : setNewEvent({...newEvent, time: e.target.value})} 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none" 
                    placeholder="09:00 AM"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Location</label>
                <input 
                  required 
                  type="text" 
                  value={editingEvent ? editingEvent.location : newEvent.location} 
                  onChange={e => editingEvent ? setEditingEvent({...editingEvent, location: e.target.value}) : setNewEvent({...newEvent, location: e.target.value})} 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none" 
                  placeholder="e.g. Auditorium" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                <textarea 
                  rows={3} 
                  value={editingEvent ? editingEvent.desc : newEvent.desc} 
                  onChange={e => editingEvent ? setEditingEvent({...editingEvent, desc: e.target.value}) : setNewEvent({...newEvent, desc: e.target.value})} 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none resize-none" 
                  placeholder="Details about the event..." 
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsAddEventOpen(false); setEditingEvent(null); }} 
                  className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors"
                >
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[90] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1 block">Event Details</span>
                <h3 className="text-xl font-bold text-slate-900">{selectedEvent.title}</h3>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400">✕</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Date & Time</p>
                  <p className="text-xs font-semibold text-slate-700">{selectedEvent.date}</p>
                  <p className="text-[10px] text-slate-500">{selectedEvent.time}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Location</p>
                  <p className="text-xs font-semibold text-slate-700">{selectedEvent.location}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 tracking-wider">Description</p>
                <p className="text-slate-600 text-sm leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200 italic">
                  "{selectedEvent.desc}"
                </p>
              </div>
              <div className="pt-4 flex gap-3">
                <button className="flex-1 py-3 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition-colors" onClick={() => setSelectedEvent(null)}>Close</button>
                <button 
                  disabled={isAddingToCalendar !== null}
                  onClick={() => handleAddToCalendar(selectedEvent.id)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isAddingToCalendar === selectedEvent.id ? 'bg-green-500 text-white shadow-green-100' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isAddingToCalendar === selectedEvent.id ? '✓ Added' : 'Add to Calendar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View All Events Modal */}
      {isAllEventsOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[80] animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Upcoming Academic Calendar</h3>
                <p className="text-xs text-slate-400 mt-1">Found {events.length} scheduled items</p>
              </div>
              <button onClick={() => setIsAllEventsOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 divide-y divide-slate-200">
              {events.length === 0 ? (
                <div className="py-20 text-center text-slate-400">No events found in the database.</div>
              ) : (
                events.map((event) => (
                  <div key={event.id} className="py-4 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center shadow-sm">
                        <span className="text-[10px] font-black text-indigo-600 uppercase leading-none">{event.date.split(' ')[0]}</span>
                        <span className="text-sm font-bold text-slate-900 leading-none mt-1">{event.date.split(' ')[1]?.replace(',', '') || '??'}</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{event.title}</p>
                        <p className="text-xs text-slate-500">{event.time} • {event.location}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedEvent(event)} className="px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg font-bold text-xs">Details</button>
                      <button onClick={() => setEditingEvent(event)} className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-bold text-xs">Edit</button>
                      <button 
                        onClick={(e) => handleRemoveEvent(e, event.id)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                          confirmingDeleteId === event.id ? 'bg-red-600 text-white' : 'text-red-400 hover:bg-red-50'
                        }`}
                      >
                        {confirmingDeleteId === event.id ? 'Confirm?' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-6 border-t bg-white flex gap-4">
              <button onClick={() => { setIsAllEventsOpen(false); setIsAddEventOpen(true); }} className="flex-1 py-3 bg-indigo-50 text-indigo-700 rounded-2xl font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors">Add New Event</button>
              <button onClick={() => setIsAllEventsOpen(false)} className="flex-1 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-colors">Back to Dashboard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
