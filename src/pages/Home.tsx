
const Home = ({ onHireClick }: { onHireClick?: () => void }) => {
  return (
    <main className="lg:ml-72 p-6 sm:p-8 md:p-10 lg:p-12 min-h-screen bg-[#2b2b2d] text-white pb-24 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      {/* Mobile Profile Picture (Visible only on small screens) */}
      <div className="flex flex-col items-center mb-8 lg:hidden">
        <img
          src="/Images/profile.jpg"
          alt="Profile Picture"
          className="w-32 h-32 object-cover rounded-full border-4 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
        />
        {/* Mobile For Hire Button */}
        {onHireClick && (
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
        )}
      </div>

      {/* Header with Resume Buttons */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8 relative z-10">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-sm">
            Hi, I'm Kristian Koome.
          </h1>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400 tracking-tight mt-2">
            Full Stack MERN Developer
          </h2>
        </div>

        {/* Resume Download Buttons */}
        <div className="flex flex-wrap gap-4 mt-2 sm:mt-0 justify-center sm:justify-start">
          {/* PDF Resume */}
          <a
            href="/Resume/Resume.pdf"
            download="Kristian_Koome_Resume.pdf"
            className="group flex items-center gap-3 px-5 py-2.5 bg-[#1e1e20]/80 backdrop-blur-md border border-white/5 rounded-xl transition-all duration-300 hover:bg-[#2b2b2d] hover:border-red-500/30 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(239,68,68,0.3)]"
          >
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <i className="fas fa-file-pdf text-red-500 text-lg"></i>
            </div>
            <span className="font-semibold text-gray-300 group-hover:text-white transition-colors tracking-wide text-sm">Resume (PDF)</span>
          </a>

          {/* Word Resume */}
          <a
            href="/Resume/Resume.docx"
            download="Kristian_Koome_Resume.docx"
            className="group flex items-center gap-3 px-5 py-2.5 bg-[#1e1e20]/80 backdrop-blur-md border border-white/5 rounded-xl transition-all duration-300 hover:bg-[#2b2b2d] hover:border-blue-500/30 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(59,130,246,0.3)]"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <i className="fas fa-file-word text-blue-500 text-lg"></i>
            </div>
            <span className="font-semibold text-gray-300 group-hover:text-white transition-colors tracking-wide text-sm">Resume (Word)</span>
          </a>
        </div>
      </div>

      <ul className="flex flex-wrap justify-center sm:justify-start list-none gap-x-6 gap-y-2 mb-8 text-gray-400 font-medium tracking-wide relative z-10">
        <li className="flex items-center gap-2">
          <i className="fas fa-map-marker-alt text-green-500"></i> Based in Nairobi, Kenya
        </li>
        <li className="flex items-center gap-2">
          <i className="fas fa-laptop-house text-green-500"></i> Available for Hybrid & Remote Roles
        </li>
      </ul>

      <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-4xl mb-12 relative z-10 font-light">
        I am a passionate and seasoned Software Engineer specializing in the MERN stack. 
        I focus on engineering clean, scalable, and highly performant web applications that drive 
        measurable business growth. My mission is to collaborate with forward-thinking teams 
        to build digital experiences that leave a lasting impact.
      </p>

      <hr className="border-t border-white/10 mb-10 relative z-10" />

      {/* Skills Section */}
      <div className="mb-4 relative z-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
          Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Arsenal</span>
        </h2>
        <p className="text-gray-400 text-lg">Technologies and tools I leverage to build modern applications.</p>
      </div>

      <div className="overflow-hidden whitespace-nowrap mb-6 pt-10 relative">
        {/* Subtle gradient fades on the edges for a professional look */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#2b2b2d] to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#2b2b2d] to-transparent z-10"></div>
        
        <div className="inline-flex gap-4 animate-marquee-left w-max">
          {[
            { name: "MongoDB", icon: "devicon-mongodb-plain text-green-500" },
            { name: "Express.js", icon: "devicon-express-original text-gray-300" },
            { name: "React", icon: "devicon-react-original text-cyan-400" },
            { name: "Node.js", icon: "devicon-nodejs-plain text-green-600" },
            { name: "Figma", icon: "fab fa-figma text-pink-500" },
            { name: "Python", icon: "devicon-python-plain text-yellow-500" },
            { name: "Flutter", icon: "devicon-flutter-plain text-sky-400" },
            { name: "Git", icon: "devicon-git-plain text-orange-500" },
            { name: "Linux", icon: "devicon-linux-plain text-gray-200" },
            { name: "Supabase", icon: "special-supabase" },
            // Duplicated set for seamless infinite scrolling
            { name: "MongoDB", icon: "devicon-mongodb-plain text-green-500" },
            { name: "Express.js", icon: "devicon-express-original text-gray-300" },
            { name: "React", icon: "devicon-react-original text-cyan-400" },
            { name: "Node.js", icon: "devicon-nodejs-plain text-green-600" },
            { name: "Figma", icon: "fab fa-figma text-pink-500" },
            { name: "Python", icon: "devicon-python-plain text-yellow-500" },
            { name: "Flutter", icon: "devicon-flutter-plain text-sky-400" },
            { name: "Git", icon: "devicon-git-plain text-orange-500" },
            { name: "Linux", icon: "devicon-linux-plain text-gray-200" },
            { name: "Supabase", icon: "special-supabase" },
          ].map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-6 py-3 bg-[#3a3a3c]/30 backdrop-blur-md border border-white/5 text-gray-300 rounded-2xl hover:bg-white/5 hover:border-white/20 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-default"
            >
              {skill.icon === "special-supabase" ? (
                <div className="w-6 h-6">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]"
                    alt="Supabase Logo"
                  />
                </div>
              ) : (
                <i className={`${skill.icon} text-2xl`}></i>
              )}
              <span className="font-semibold tracking-wide">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden whitespace-nowrap relative">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#2b2b2d] to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#2b2b2d] to-transparent z-10"></div>
        
        <div className="inline-flex gap-4 animate-marquee-left pb-4 w-max">
          {[
            { name: "Flask", icon: "devicon-flask-original text-gray-300" },
            { name: "SQLite3", icon: "devicon-sqlite-plain text-blue-400" },
            { name: "Firebase", icon: "devicon-firebase-plain text-yellow-500" },
            { name: "GitHub Actions", icon: "fab fa-github text-white" },
            { name: "Vite", icon: "devicon-vitejs-plain text-purple-500" },
            { name: "Bootstrap", icon: "devicon-bootstrap-plain text-indigo-500" },
            { name: "HTML", icon: "devicon-html5-plain text-orange-500" },
            { name: "Tailwind CSS", icon: "devicon-tailwindcss-plain text-teal-400" },
            { name: "React Router", icon: "fas fa-route text-red-500" },
            // Duplicated set for seamless infinite scrolling
            { name: "Flask", icon: "devicon-flask-original text-gray-300" },
            { name: "SQLite3", icon: "devicon-sqlite-plain text-blue-400" },
            { name: "Firebase", icon: "devicon-firebase-plain text-yellow-500" },
            { name: "GitHub Actions", icon: "fab fa-github text-white" },
            { name: "Vite", icon: "devicon-vitejs-plain text-purple-500" },
            { name: "Bootstrap", icon: "devicon-bootstrap-plain text-indigo-500" },
            { name: "HTML", icon: "devicon-html5-plain text-orange-500" },
            { name: "Tailwind CSS", icon: "devicon-tailwindcss-plain text-teal-400" },
            { name: "React Router", icon: "fas fa-route text-red-500" },
          ].map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-6 py-3 bg-[#3a3a3c]/30 backdrop-blur-md border border-white/5 text-gray-300 rounded-2xl hover:bg-white/5 hover:border-white/20 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-default"
            >
              <i className={`${skill.icon} text-2xl`}></i>
              <span className="font-semibold tracking-wide">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-t border-white/10 mt-16 mb-10 relative z-10" />

      {/* Services Section */}
      <div className="relative z-10 flex flex-col">
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-sm mb-2">
            My Services.
          </h2>
          <p className="text-green-400 font-bold tracking-widest uppercase text-xs sm:text-sm">What I bring to the table</p>
          
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mt-6 font-light">
            I architect and engineer elite digital products for forward-thinking brands, ambitious startups, and modern enterprises. 
            By merging deep technical expertise with a relentless focus on user experience, I deliver scalable software that actively drives your business objectives.
          </p>
        </div>

        <div className="bg-[#1e1e20]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl w-full relative overflow-hidden group hover:border-green-500/30 transition-all duration-700">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-green-500/20 transition-all duration-700 group-hover:scale-150"></div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 relative z-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shadow-inner group-hover:border-green-500/50 transition-colors duration-500">
                  <i className="fas fa-rocket text-green-400 text-xl group-hover:animate-bounce"></i>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Ready to accelerate?
                </h3>
              </div>
              
              <p className="text-gray-400 text-lg leading-relaxed font-light">
                I am actively seeking full-time engineering roles and elite freelance opportunities. 
                Let's discuss how my technical expertise can bring your vision to life.
              </p>
            </div>

            <button
              onClick={onHireClick}
              className="group relative inline-flex items-center gap-4 px-6 sm:px-8 py-4 bg-gradient-to-r from-green-600/10 to-emerald-500/10 backdrop-blur-md border border-green-500/30 text-white font-bold rounded-2xl hover:from-green-600/20 hover:to-emerald-500/20 hover:border-green-400/60 transition-all duration-500 shadow-[0_0_20px_rgba(34,197,94,0.05)] hover:shadow-[0_0_40px_rgba(34,197,94,0.2)] transform hover:-translate-y-1 w-full sm:w-auto justify-center flex-shrink-0"
            >
              <span className="relative flex h-3 w-3 shadow-[0_0_10px_rgba(34,197,94,0.8)] rounded-full">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="tracking-widest text-sm sm:text-base text-white font-extrabold uppercase whitespace-nowrap">Hire Me Today</span>
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/40 transition-colors group-hover:translate-x-1">
                <i className="fas fa-arrow-right text-green-400 text-sm"></i>
              </div>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
