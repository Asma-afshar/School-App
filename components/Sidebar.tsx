
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'students', label: 'Students', icon: '🎓' },
    { id: 'teachers', label: 'Teachers', icon: '🍎' },
    { id: 'courses', label: 'Courses', icon: '📚' },
    { id: 'admission', label: 'Admission', icon: '✍️' },
    { id: 'attendance', label: 'Attendance', icon: '📝' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: '✨' },
  ];

  return (
    <div className="w-64 bg-white h-screen border-r border-slate-200 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <span>🏫</span> EduPulse
        </h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === item.id
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
            AD
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900">Admin User</p>
            <p className="text-[10px] text-slate-500">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
