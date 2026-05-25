const Contact = () => {
  return (
    <main className="lg:ml-72 p-6 min-h-screen bg-[#2b2b2d] text-white pb-24 relative overflow-hidden">
      {/* Contact Section */}
      <section className="py-8 md:py-16 px-4 md:px-6 relative z-10">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tighter text-white drop-shadow-lg leading-tight">
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 filter drop-shadow-[0_0_15px_rgba(34,197,94,0.3)] block sm:inline">Connect.</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Have a project in mind or looking for a dedicated developer? <br className="hidden md:block" />
              My inbox is always open. Let's create something amazing together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Phone */}
            <div className="group bg-[#1e1e20]/80 backdrop-blur-xl border border-white/5 p-5 sm:p-6 md:p-8 rounded-3xl shadow-2xl hover:bg-[#2b2b2d] hover:border-green-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.2)] flex items-center gap-4 md:gap-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 group-hover:border-green-500/40 transition-all duration-500 shadow-inner">
                <i className="fas fa-phone-alt text-xl md:text-2xl text-gray-400 group-hover:text-green-400 transition-colors"></i>
              </div>
              <div className="overflow-hidden w-full">
                <p className="text-[10px] sm:text-xs font-bold tracking-widest text-gray-500 uppercase mb-1">Phone</p>
                <p className="text-sm sm:text-base md:text-xl font-bold text-white group-hover:text-green-400 transition-colors truncate">+254 759 725 385</p>
              </div>
            </div>

            {/* Email */}
            <div className="group bg-[#1e1e20]/80 backdrop-blur-xl border border-white/5 p-5 sm:p-6 md:p-8 rounded-3xl shadow-2xl hover:bg-[#2b2b2d] hover:border-green-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.2)] flex items-center gap-4 md:gap-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 group-hover:border-green-500/40 transition-all duration-500 shadow-inner">
                <i className="fas fa-envelope text-xl md:text-2xl text-gray-400 group-hover:text-green-400 transition-colors"></i>
              </div>
              <div className="overflow-hidden w-full">
                <p className="text-[10px] sm:text-xs font-bold tracking-widest text-gray-500 uppercase mb-1">Email</p>
                <p className="text-sm sm:text-base md:text-xl font-bold text-white group-hover:text-green-400 transition-colors truncate">kristian.koome@outlook.com</p>
              </div>
            </div>

            {/* Location */}
            <div className="group bg-[#1e1e20]/80 backdrop-blur-xl border border-white/5 p-5 sm:p-6 md:p-8 rounded-3xl shadow-2xl hover:bg-[#2b2b2d] hover:border-green-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.2)] flex items-center gap-4 md:gap-6 relative overflow-hidden">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 group-hover:border-green-500/40 transition-all duration-500 shadow-inner">
                <i className="fas fa-map-marker-alt text-xl md:text-2xl text-gray-400 group-hover:text-green-400 transition-colors"></i>
              </div>
              <div className="overflow-hidden w-full">
                <p className="text-[10px] sm:text-xs font-bold tracking-widest text-gray-500 uppercase mb-1">Location</p>
                <p className="text-sm sm:text-base md:text-xl font-bold text-white group-hover:text-green-400 transition-colors truncate">Nairobi, Kenya</p>
              </div>
            </div>

            {/* GitHub */}
            <a
              href="https://github.com/Kristiann001"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#1e1e20]/80 backdrop-blur-xl border border-white/5 p-5 sm:p-6 md:p-8 rounded-3xl shadow-2xl hover:bg-[#2b2b2d] hover:border-gray-400/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)] flex items-center gap-4 md:gap-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-gray-500/20 group-hover:border-gray-400/40 transition-all duration-500 shadow-inner">
                <i className="fab fa-github text-xl md:text-2xl text-gray-400 group-hover:text-white transition-colors"></i>
              </div>
              <div className="overflow-hidden w-full">
                <p className="text-[10px] sm:text-xs font-bold tracking-widest text-gray-500 uppercase mb-1">GitHub</p>
                <p className="text-sm sm:text-base md:text-xl font-bold text-white transition-colors truncate">@Kristiann001</p>
              </div>
              <div className="absolute right-4 md:right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 hidden sm:block">
                <i className="fas fa-external-link-alt text-gray-300"></i>
              </div>
            </a>
          </div>

          {/* LinkedIn (Full Width) */}
          <div className="mt-4 md:mt-6 flex justify-center">
            <a
              href="https://www.linkedin.com/in/kristian-koome"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-2/3 group bg-[#1e1e20]/80 backdrop-blur-xl border border-white/5 p-5 sm:p-6 md:p-8 rounded-3xl shadow-2xl hover:bg-[#2b2b2d] hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.2)] flex items-center gap-4 md:gap-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 group-hover:border-blue-500/40 transition-all duration-500 shadow-inner">
                <i className="fab fa-linkedin text-xl md:text-2xl text-gray-400 group-hover:text-blue-400 transition-colors"></i>
              </div>
              <div className="overflow-hidden w-full">
                <p className="text-[10px] sm:text-xs font-bold tracking-widest text-gray-500 uppercase mb-1">LinkedIn</p>
                <p className="text-sm sm:text-base md:text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate">/in/kristian-koome</p>
              </div>
              <div className="absolute right-4 md:right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 hidden sm:block">
                <i className="fas fa-external-link-alt text-blue-400"></i>
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
