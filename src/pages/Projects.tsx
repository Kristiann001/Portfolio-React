import { useState, useEffect, useCallback, useRef } from 'react';
import Swal from 'sweetalert2';
import { supabase } from '../utils/supabase';
import { cacheGet, cacheBust } from '../utils/cache';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  loom_link?: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    loom_link: '',
    imageType: 'url', // defaulting to url for simplicity if no file
    imageUrl: '',
  });
  const [status, setStatus] = useState('');
  const [statusColor, setStatusColor] = useState('text-white');
  const [adminPassword, setAdminPassword] = useState('');
  const imageFileRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);


  const loadProjects = useCallback(async (bustCache = false) => {
    setLoading(true);
    try {
      if (bustCache) cacheBust('projects');
      const data = await cacheGet('projects', async () => {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data ?? [];
      });
      setProjects(data);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAdminMode = () => {
    if (isAdminVerified) {
      setIsAdminVerified(false);
    } else {
      setAdminModalOpen(true);
    }
  };

  const openModal = (id: string | null = null) => {
    showForm(id);
  };

  const showForm = (id: string | null = null) => {
    setEditingId(id);
    if (id) {
      const proj = projects.find((p) => p.id === id);
      if (proj) {
        setFormData({
          title: proj.title,
          description: proj.description,
          link: proj.link || '',
          loom_link: proj.loom_link || '',
          imageType: 'url',
          imageUrl: proj.image || '',
        });
      }
    } else {
      setFormData({
        title: '',
        description: '',
        link: '',
        loom_link: '',
        imageType: 'url',
        imageUrl: '',
      });
    }
    setStatus('');
    setImagePreview(null);
    setModalOpen(true);
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple frontend verification for demo without backend
    const secretPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'acemiano001';
    
    if (adminPassword === secretPassword) {
      setIsAdminVerified(true);
      setAdminModalOpen(false);
      setAdminPassword('');
      Swal.fire({
        icon: "success",
        title: "Admin Access Granted",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#2b2b2d",
        color: "#ffffff",
      });
    } else {
      setAdminPassword('');
      Swal.fire({
        icon: "error",
        title: "Incorrect Password",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#2b2b2d",
        color: "#ffffff",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, description, link, loom_link } = formData;

    if (!title || !description) {
      setStatus('Title and description are required');
      setStatusColor('text-red-400');
      return;
    }

    setStatus('Saving...');
    setStatusColor('text-white');

    let finalImageUrl = formData.imageUrl;

    // Handle file upload — convert to base64 and store in DB directly
    if (formData.imageType === 'file') {
      const fileInput = imageFileRef.current;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        try {
          finalImageUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(file);
          });
        } catch (err) {
          console.error("File read error:", err);
          setStatus('Failed to read image file.');
          setStatusColor('text-red-400');
          return;
        }
      }
    }

    try {
      const projectData = {
        title,
        description,
        link,
        loom_link,
        image: finalImageUrl
      };

      if (editingId) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);
        if (error) throw error;
      }

      Swal.fire({
        icon: 'success',
        title: editingId ? 'Project updated!' : 'Project added!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#2b2b2d',
        color: '#ffffff',
      });

      setModalOpen(false);
      loadProjects(true);
    } catch (err) {
      console.error(err);
      setStatus('Failed to save project. Please try again.');
      setStatusColor('text-red-400');
    }
  };

  const deleteProject = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: '#2b2b2d',
      color: '#ffffff',
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;
        
        loadProjects(true);
        Swal.fire({
          title: 'Deleted!',
          text: 'The project has been deleted.',
          icon: 'success',
          background: '#2b2b2d',
          color: '#ffffff',
          confirmButtonColor: '#16a34a',
        });
      } catch {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete project.',
          icon: 'error',
          background: '#2b2b2d',
          color: '#ffffff',
          confirmButtonColor: '#16a34a',
        });
      }
    }
  };

  return (
    <main className="lg:ml-72 p-4 sm:p-8 md:p-10 lg:p-12 min-h-screen bg-[#2b2b2d] text-white pb-24 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none"></div>
      <section className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6 mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 drop-shadow-sm mb-2 break-words">
              My Projects.
            </h2>
            <p className="text-cyan-400 font-bold tracking-widest uppercase text-xs sm:text-sm">Engineering & Design Showcase</p>
          </div>
          <button
            onClick={toggleAdminMode}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl flex-shrink-0 shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
              isAdminVerified 
                ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20" 
                : "bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:bg-white/10"
            }`}
          >
            {isAdminVerified ? "Exit Admin" : "Admin"}
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light max-w-3xl">
            A showcase of digital products and applications I've engineered. 
            Each project demonstrates my approach to solving complex problems using modern technologies and intuitive design.
          </p>
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 bg-[#3a3a3c] border border-white/10 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            {isAdminVerified && (
              <button onClick={() => openModal()} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition whitespace-nowrap">
                <i className="fas fa-plus mr-2"></i>Add Project
              </button>
            )}
          </div>
        </div>

        <hr className="border-t border-white/20 mb-12" />

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            <p className="mt-4 text-white/70">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-briefcase text-6xl text-gray-500 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
            <p className="text-white/70 mb-6">
              {isAdminVerified ? "Add your first project to showcase your work!" : "Check back later for updates."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((proj) => {
              const linkHtml = proj.link ? (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-medium rounded-lg transition-all shadow-lg hover:shadow-green-900/30 transform hover:-translate-y-0.5"
                >
                  <span>Code/Live</span>
                  <i className="fas fa-external-link-alt"></i>
                </a>
              ) : (
                <span className="px-3 py-2 bg-gray-700/50 text-gray-500 text-xs font-medium rounded-lg cursor-not-allowed border border-white/5">
                  No Link
                </span>
              );


              return (
                <div
                  key={proj.id}
                  onClick={() => setHoveredProject(proj)}
                  className="group bg-[#3a3a3c] bg-gradient-to-br from-[#3a3a3c] to-[#2b2b2d] rounded-2xl overflow-hidden border border-white/10 hover:border-green-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex flex-col h-full ring-1 ring-white/5 cursor-pointer"
                >
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2b2b2d] to-transparent opacity-80 z-10 bottom-0 h-2/3"></div>
                    <img
                      src={proj.image || "https://placehold.co/600x400/2b2b2d/ffffff?text=No+Image"}
                      alt={proj.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                      {isAdminVerified && (
                        <div className="bg-black/50 backdrop-blur-md rounded-lg p-1.5 border border-white/10 flex gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); openModal(proj.id); }}
                            className="p-2 text-white hover:text-blue-400 transition-colors rounded hover:bg-white/10"
                            title="Edit"
                          >
                            <i className="fas fa-pen text-sm"></i>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteProject(proj.id); }}
                            className="p-2 text-white hover:text-red-400 transition-colors rounded hover:bg-white/10"
                            title="Delete"
                          >
                            <i className="fas fa-trash-alt text-sm"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow relative z-20">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors tracking-tight">
                      {proj.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">{proj.description}</p>

                    <div className="mt-auto pt-5 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                      <div className="ml-auto flex gap-2">
                        {linkHtml}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {hoveredProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 transition-all duration-300 cursor-pointer"
          onClick={() => setHoveredProject(null)}
        >
          <div 
            className="bg-[#1e1e20] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.3)] max-w-2xl w-full border border-green-500/50 transform scale-100 opacity-100 transition-all duration-300 flex flex-col max-h-[90vh] cursor-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setHoveredProject(null)}
              className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
            <div className="h-56 sm:h-72 w-full relative shrink-0">
              <img src={hoveredProject.image || "https://placehold.co/800x600/2b2b2d/ffffff?text=No+Image"} alt={hoveredProject.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e20] to-transparent opacity-90"></div>
            </div>
            <div className="p-5 sm:p-8 relative -mt-12 sm:-mt-16 overflow-y-auto custom-scrollbar">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 drop-shadow-md break-words">{hoveredProject.title}</h3>
              <p className="text-gray-300 text-base leading-relaxed">{hoveredProject.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Password Modal */}
      {adminModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 px-4 transition-all duration-300">
          <div className="bg-[#1e1e20]/90 border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.15)] w-full max-w-md p-6 sm:p-8 relative transform scale-100">
            <button
              onClick={() => setAdminModalOpen(false)}
              className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <i className="fas fa-times"></i>
            </button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                <i className="fas fa-shield-alt text-2xl text-green-400"></i>
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
                Admin Access
              </h2>
              <p className="text-gray-400 text-sm">
                Please verify your identity to continue
              </p>
            </div>
            <form onSubmit={handleAdminSubmit}>
              <div className="mb-6 relative">
                <label
                  className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2"
                  htmlFor="admin-password"
                >
                  Security Key
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="admin-password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    autoComplete="off"
                    className="w-full pl-11 pr-12 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all font-medium tracking-widest"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg shadow-green-900/40 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Authenticate</span>
                <i className="fas fa-arrow-right text-sm"></i>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-all duration-300">
          <div className="bg-[#1e1e20]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-green-500/10 w-full max-w-lg p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">
              <i className="fas fa-times"></i>
            </button>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">{editingId ? 'Edit Project' : 'Add Project'}</h2>
              <p className="text-gray-400 text-sm">Share your latest work with the world</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2" htmlFor="proj-title">
                  Project Title <span className="text-green-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <i className="fas fa-heading"></i>
                  </span>
                  <input
                    type="text"
                    id="proj-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all font-medium"
                    placeholder="e.g., E-Commerce Platform"
                  />
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2" htmlFor="proj-description">
                  Description <span className="text-green-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute top-3 left-3 text-gray-500">
                    <i className="fas fa-align-left"></i>
                  </span>
                  <textarea
                    id="proj-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all resize-none"
                    placeholder="Brief description of the project..."
                  ></textarea>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Project Image</label>
                <div className="flex p-1 bg-black/40 rounded-lg mb-3">
                  <label className="flex-1 text-center cursor-pointer">
                    <input
                      type="radio"
                      name="imageType"
                      value="file"
                      checked={formData.imageType === 'file'}
                      onChange={(e) => setFormData({ ...formData, imageType: e.target.value })}
                      className="peer hidden"
                    />
                    <span className="block py-2 rounded-md text-sm font-medium text-gray-400 peer-checked:bg-[#2b2b2d] peer-checked:text-white peer-checked:shadow-sm transition-all text-white">
                      Upload
                    </span>
                  </label>
                  <label className="flex-1 text-center cursor-pointer">
                    <input
                      type="radio"
                      name="imageType"
                      value="url"
                      checked={formData.imageType === 'url'}
                      onChange={(e) => setFormData({ ...formData, imageType: e.target.value })}
                      className="peer hidden"
                    />
                    <span className="block py-2 rounded-md text-sm font-medium text-gray-400 peer-checked:bg-[#2b2b2d] peer-checked:text-white peer-checked:shadow-sm transition-all text-white">
                      URL
                    </span>
                  </label>
                </div>

                {formData.imageType === 'file' ? (
                  <>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-green-500/50 hover:bg-black/20 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <i className="fas fa-cloud-upload-alt text-2xl text-gray-500 group-hover:text-green-500 mb-2 transition-colors"></i>
                        <p className="mb-1 text-sm text-gray-400">
                          <span className="font-semibold text-white">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 10MB)</p>
                      </div>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="hidden"
                        ref={imageFileRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => setImagePreview(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {imagePreview && (
                      <div className="mt-3 flex items-center gap-3 p-3 bg-black/30 rounded-xl border border-green-500/30">
                        <img src={imagePreview} alt="Preview" className="w-20 h-14 rounded-lg object-cover" />
                        <div>
                          <p className="text-xs font-bold text-green-400">✓ Image ready to upload</p>
                          <p className="text-xs text-gray-500 mt-0.5">Will be saved when you click Save</p>
                        </div>
                        <button type="button" onClick={() => { setImagePreview(null); if (imageFileRef.current) imageFileRef.current.value = ''; }} className="ml-auto text-gray-500 hover:text-red-400 transition-colors">
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <i className="fas fa-link"></i>
                    </span>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                      placeholder="https://example.com/project-screenshot.jpg"
                    />
                  </div>
                )}
              </div>
              <div className="mb-8">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2" htmlFor="proj-link">
                    Live Demo / GitHub
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <i className="fab fa-github"></i>
                    </span>
                    <input
                      type="url"
                      id="proj-link"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-500 hover:to-green-400 transition-all shadow-lg shadow-green-900/40 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-save"></i>
                  <span>Save Project</span>
                </button>
              </div>
              {status && <p className={`mt-4 text-center ${statusColor}`}>{status}</p>}
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Projects;
