
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Students from './views/Students';
import AIAssistant from './views/AIAssistant';
import AdmissionForm from './views/AdmissionForm';
import Courses from './views/Courses';
import Teachers from './views/Teachers';
import Attendance from './views/Attendance';

interface SchoolConfig {
  name: string;
  term: string;
  email: string;
}

const SettingsView: React.FC<{
  config: SchoolConfig;
  onSave: (newConfig: SchoolConfig) => void;
}> = ({ config, onSave }) => {
  const [localConfig, setLocalConfig] = useState<SchoolConfig>(config);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      onSave(localConfig);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-3xl animate-in fade-in slide-in-from-bottom-4">
      <h3 className="text-xl font-bold mb-6 text-slate-900">School Configuration</h3>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">School Name</label>
            <input 
              type="text" 
              value={localConfig.name} 
              onChange={e => setLocalConfig({...localConfig, name: e.target.value})}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
              placeholder="e.g. EduPulse International"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Term</label>
            <select 
              value={localConfig.term}
              onChange={e => setLocalConfig({...localConfig, term: e.target.value})}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            >
              <option>Spring 2024</option>
              <option>Fall 2024</option>
              <option>Winter 2024</option>
            </select>
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Notification Email</label>
          <input 
            type="email" 
            value={localConfig.email} 
            onChange={e => setLocalConfig({...localConfig, email: e.target.value})}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
            placeholder="admin@school.edu"
          />
        </div>
        <div className="pt-4">
          <button 
            type="submit"
            disabled={isSaving}
            className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
              showSuccess 
              ? 'bg-green-500 text-white shadow-green-100 scale-[1.02]' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 active:scale-95'
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : showSuccess ? (
              <>
                <span>✓</span> Configuration Saved
              </>
            ) : (
              'Save All Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(() => {
    const saved = localStorage.getItem('edupulse_config');
    return saved ? JSON.parse(saved) : {
      name: 'EduPulse International',
      term: 'Spring 2024',
      email: 'admin@edupulse.edu'
    };
  });
  
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Gemini: 5 student reports generated", read: false },
    { id: 2, text: "New Admission: Alice Johnson applied", read: false },
    { id: 3, text: "System Update: Version 2.4 live", read: true }
  ]);

  useEffect(() => {
    localStorage.setItem('edupulse_config', JSON.stringify(schoolConfig));
  }, [schoolConfig]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'students': return <Students />;
      case 'courses': return <Courses />;
      case 'admission': return <AdmissionForm />;
      case 'teachers': return <Teachers />;
      case 'attendance': return <Attendance />;
      case 'ai-assistant': return <AIAssistant />;
      case 'settings': return <SettingsView config={schoolConfig} onSave={setSchoolConfig} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900 capitalize leading-none">
              {activeTab.replace('-', ' ')}
            </h2>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1">School Management Suite</p>
          </div>
          <div className="flex items-center gap-3 relative">
            <div className="hidden md:flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Term: {schoolConfig.term}</span>
            </div>
            
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center relative hover:bg-slate-50"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-12 right-12 w-80 bg-white border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                  <span className="font-bold text-sm">Notifications</span>
                  <button onClick={markAllRead} className="text-xs text-indigo-600 hover:underline">Mark all read</button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-4 text-sm border-b last:border-0 ${n.read ? 'opacity-50' : 'bg-indigo-50/30'}`}>
                      {n.text}
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowNotifications(false)} className="w-full p-2 text-xs text-slate-400 hover:bg-slate-50">Close</button>
              </div>
            )}

            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center hover:bg-slate-50 transition-all ${activeTab === 'settings' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'}`}
            >
              ⚙️
            </button>
          </div>
        </header>

        <div className="p-8 flex-1">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            {renderContent()}
          </div>
        </div>
        
        <footer className="p-8 border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
            <p>© {new Date().getFullYear()} {schoolConfig.name} Systems Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <button className="hover:text-indigo-600">Privacy Policy</button>
              <button className="hover:text-indigo-600">Terms of Service</button>
              <button className="hover:text-indigo-600">Support Center</button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
