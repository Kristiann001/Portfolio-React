import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ onHireClick }: { onHireClick: () => void }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'fa-home', label: 'Home' },
    { path: '/about', icon: 'fa-user', label: 'About' },
    { path: '/achievements', icon: 'fa-trophy', label: 'Achievements' },
    { path: '/projects', icon: 'fa-briefcase', label: 'Projects' },
    { path: '/contact', icon: 'fa-envelope', label: 'Contact' },
  ];

  return (
    <aside
      id="sidebar-multi-level-sidebar"
      className="fixed top-0 left-0 z-40 w-72 h-screen transition-transform -translate-x-full lg:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-[#2b2b2d] text-white">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/Images/profile.jpg"
            alt="Profile Picture"
            className="w-24 h-24 rounded-full border-4 border-green-500"
          />
          <h1 className="mt-3 text-lg font-semibold text-white flex items-center gap-2">
            Kristian Koome
            <i className="fas fa-check-circle text-green-500 text-base" title="Verified"></i>
          </h1>
          <h2 className="mt-1 text-sm font-semibold text-white">
            kristian.koome@outlook.com
          </h2>

          {/* For Hire Button */}
          <button
            onClick={onHireClick}
            className="mt-4 group flex items-center justify-center gap-2.5 px-5 py-2 text-[11px] sm:text-xs font-bold text-green-400 bg-green-500/5 border border-green-500/20 rounded-full hover:bg-green-500/10 hover:border-green-400/50 hover:text-green-300 transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:-translate-y-0.5 focus:outline-none cursor-pointer uppercase tracking-widest"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>Available for hire</span>
          </button>
        </div>

        {/* Navigation */}
        <ul className="space-y-2 font-medium">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-lg ${
                  location.pathname === item.path ? 'bg-[#3b3b3d]' : 'hover:bg-[#3b3b3d]'
                }`}
              >
                <i className={`fas ${item.icon} w-5 h-5 text-white`}></i>
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
