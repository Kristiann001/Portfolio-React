import { Link, useLocation } from 'react-router-dom';

const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'fa-home', label: 'Home' },
    { path: '/about', icon: 'fa-user', label: 'About' },
    { path: '/achievements', icon: 'fa-trophy', label: 'Awards' },
    { path: '/projects', icon: 'fa-briefcase', label: 'Projects' },
    { path: '/contact', icon: 'fa-envelope', label: 'Contact' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#2b2b2d]/95 backdrop-blur-md border-t border-white/10 flex justify-around items-center h-16 lg:hidden px-2">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center justify-center w-full h-full ${
            location.pathname === item.path
              ? 'text-green-500'
              : 'text-white/60 hover:text-green-400 transition-colors'
          }`}
        >
          <i className={`fas ${item.icon} text-lg mb-1`}></i>
          <span className="text-[10px]">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default MobileNav;
