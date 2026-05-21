import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { supabase } from "../utils/supabase";

interface Education {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  description: string;
  image_url: string;
}

const About = () => {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  // Simple Admin Mode for CRUD
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Education> & { startDate?: string; endDate?: string; imageType?: string; }>({ imageType: "url" });
  
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [savingStatus, setSavingStatus] = useState("");

  const fetchEducation = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setEducationList(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await supabase.from("education").delete().eq("id", id);
      fetchEducation();
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const secretPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'acemiano001';
    
    if (adminPassword === secretPassword) {
      setIsAdminMode(true);
      setAdminModalOpen(false);
      setAdminPassword("");
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
      setAdminPassword("");
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

  const toggleAdminMode = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
    } else {
      setAdminModalOpen(true);
    }
  };

  const openForm = (edu?: Education) => {
    if (edu) {
      let sDate = "";
      let eDate = "";
      if (edu.duration && edu.duration.includes(" - ")) {
        [sDate, eDate] = edu.duration.split(" - ");
      } else {
        sDate = edu.duration || "";
      }
      setFormData({
        ...edu,
        startDate: sDate.trim(),
        endDate: eDate ? eDate.trim() : "",
        imageType: "url"
      });
    } else {
      setFormData({
        institution: "",
        degree: "",
        duration: "",
        description: "",
        image_url: "",
        startDate: "",
        endDate: "",
        imageType: "url"
      });
    }
    setSavingStatus("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStatus("Saving...");
    
    let finalImageUrl = formData.image_url;

    if (formData.imageType === "file") {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        
        try {
          const { data, error } = await supabase.storage
            .from('portfolio')
            .upload(`education/${fileName}`, file);
            
          if (error) throw error;
          
          if (data) {
            const { data: publicUrlData } = supabase.storage
              .from('portfolio')
              .getPublicUrl(`education/${fileName}`);
            finalImageUrl = publicUrlData.publicUrl;
          }
        } catch (err) {
          console.error("Upload error:", err);
          setSavingStatus("Failed to upload image.");
          return;
        }
      }
    }

    const formatMonthYear = (val: string) => {
      if (!val) return "";
      const date = new Date(val);
      return date.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g. "Feb 2024"
    };

    // If user typed custom string, use it. If they picked from <input type="month">, format it.
    let parsedStart = formData.startDate || "";
    let parsedEnd = formData.endDate || "";
    
    if (parsedStart.match(/^\d{4}-\d{2}$/)) parsedStart = formatMonthYear(parsedStart);
    if (parsedEnd.match(/^\d{4}-\d{2}$/)) parsedEnd = formatMonthYear(parsedEnd);

    const combinedDuration = parsedEnd ? `${parsedStart} - ${parsedEnd}` : parsedStart;

    const payload = {
      institution: formData.institution,
      degree: formData.degree,
      duration: combinedDuration,
      description: formData.description,
      image_url: finalImageUrl,
    };

    try {
      if (formData.id) {
        // Update
        await supabase
          .from("education")
          .update(payload)
          .eq("id", formData.id);
      } else {
        // Insert
        await supabase.from("education").insert([payload]);
      }
      setShowForm(false);
      fetchEducation();
    } catch (err) {
      console.error(err);
      setSavingStatus("Failed to save.");
    }
  };

  return (
    <main className="lg:ml-72 p-6 sm:p-8 md:p-10 lg:p-12 min-h-screen bg-[#2b2b2d] text-white pb-24 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* About Section */}
      <div className="flex flex-row justify-between items-start sm:items-end gap-4 sm:gap-6 mb-8 relative z-10">
        <div className="flex-1">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-sm mb-2">
            About Me.
          </h2>
          <p className="text-green-400 font-bold tracking-widest uppercase text-xs sm:text-sm">The Developer Behind The Code</p>
        </div>
        <button
          onClick={toggleAdminMode}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl flex-shrink-0 shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
            isAdminMode 
              ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20" 
              : "bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:bg-white/10"
          }`}
        >
          {isAdminMode ? "Exit Admin" : "Admin"}
        </button>
      </div>

      <div className="relative z-10 space-y-6 max-w-4xl">
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
          I am a passionate and results-driven Software Engineer based in
          Nairobi, Kenya, specializing in the MERN stack (MongoDB, Express, React,
          Node.js) and modern cloud technologies. I engineer robust,
          scalable, and high-performance web applications that deliver real
          business value and exceptional user experiences.
        </p>

        <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
        With hands-on experience across multiple frameworks and databases, I
        adapt quickly to new technologies and thrive in collaborative
        environments. My focus is on writing maintainable code, optimizing
        performance, and implementing industry best practices — from version
        control with Git/GitHub to deploying robust full-stack solutions.
      </p>

        <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
          I am actively seeking full-time, hybrid, or freelance opportunities
          where I can bring my technical expertise, strong problem-solving skills,
          and commitment to quality to your team. If you're looking for a reliable
          developer who ships production-ready code on time, let's collaborate.
        </p>
      </div>

      <hr className="my-12 border-white/10 relative z-10" />

      {/* Education Section */}
      <section className="relative z-10">
        <div className="flex flex-row justify-between items-start sm:items-end gap-4 sm:gap-6 mb-12">
          <div className="flex-1">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-500 drop-shadow-sm mb-2">
              Education.
            </h2>
            <p className="text-green-400 font-bold tracking-widest uppercase text-xs sm:text-sm">Academic Journey & Training</p>
          </div>
          {isAdminMode && (
            <button
              onClick={() => openForm()}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl flex-shrink-0 shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-r from-green-600/20 to-emerald-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 hover:text-white"
            >
              <i className="fas fa-plus mr-2"></i> Add
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            <p className="mt-4 text-white/70">Loading education...</p>
          </div>
        ) : educationList.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/70 mb-4">No education records found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 max-w-5xl">
            {educationList.map((edu) => (
              <div
                key={edu.id}
                className="bg-[#1e1e20]/80 backdrop-blur-xl border border-white/5 p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-8 relative group hover:border-green-500/40 transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.2)] overflow-hidden"
              >
                {/* Ambient Hover Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-green-500/10 group-hover:scale-150 transition-all duration-700"></div>

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover:border-green-500/50 transition-colors duration-500 p-3 relative z-10">
                  {edu.image_url ? (
                    <img
                      src={edu.image_url}
                      alt={`${edu.institution} logo`}
                      className="w-full h-full object-contain filter group-hover:brightness-110 transition-all"
                    />
                  ) : (
                    <i className="fas fa-university text-2xl sm:text-3xl text-gray-500 group-hover:text-green-400 transition-colors"></i>
                  )}
                </div>
                
                <div className="flex-1 relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-black mb-1 text-white group-hover:text-green-400 transition-colors tracking-tight">{edu.degree}</h3>
                  <p className="text-lg sm:text-xl text-gray-300 font-medium mb-2">{edu.institution}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
                    <i className="far fa-calendar-alt text-green-400 text-xs"></i>
                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">{edu.duration}</span>
                  </div>
                  <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-light whitespace-pre-line max-w-3xl">
                    {edu.description}
                  </p>
                </div>

                {isAdminMode && (
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button
                      onClick={() => openForm(edu)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-colors"
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(edu.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Admin Password Modal */}
      {adminModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 px-4 transition-all duration-300">
          <div className="bg-[#1e1e20]/90 border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.15)] w-full max-w-md p-8 relative transform scale-100">
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

      {/* CRUD Modal for Education */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-all duration-300 py-10">
          <div className="bg-[#1e1e20]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.1)] w-full max-w-xl p-8 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {formData.id ? "Edit Education" : "Add Education"}
              </h2>
              <p className="text-gray-400 text-sm">Update your academic history</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    School Name <span className="text-green-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <i className="fas fa-university"></i>
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.institution || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, institution: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                      placeholder="e.g. Moringa School"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Field of Study <span className="text-green-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <i className="fas fa-graduation-cap"></i>
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.degree || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, degree: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                      placeholder="e.g. Software Eng."
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Start Date <span className="text-green-500">*</span>
                  </label>
                  <input
                    type="month"
                    required
                    value={formData.startDate || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1 pl-1">Month, Year</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={formData.endDate || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1 pl-1">Leave blank if present</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Image of School</label>
                <div className="flex p-1 bg-black/40 rounded-lg mb-3">
                  <label className="flex-1 text-center cursor-pointer">
                    <input
                      type="radio"
                      name="imageType"
                      value="file"
                      checked={formData.imageType === "file"}
                      onChange={(e) =>
                        setFormData({ ...formData, imageType: e.target.value })
                      }
                      className="peer hidden"
                    />
                    <span className="block py-2 rounded-md text-sm font-medium text-gray-400 peer-checked:bg-[#2b2b2d] peer-checked:text-white peer-checked:shadow-sm transition-all">
                      Upload File
                    </span>
                  </label>
                  <label className="flex-1 text-center cursor-pointer">
                    <input
                      type="radio"
                      name="imageType"
                      value="url"
                      checked={formData.imageType === "url"}
                      onChange={(e) =>
                        setFormData({ ...formData, imageType: e.target.value })
                      }
                      className="peer hidden"
                    />
                    <span className="block py-2 rounded-md text-sm font-medium text-gray-400 peer-checked:bg-[#2b2b2d] peer-checked:text-white peer-checked:shadow-sm transition-all">
                      Image URL
                    </span>
                  </label>
                </div>

                {formData.imageType === "file" ? (
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-green-500/50 hover:bg-black/20 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-3 pb-3">
                      <i className="fas fa-cloud-upload-alt text-xl text-gray-500 group-hover:text-green-500 mb-1 transition-colors"></i>
                      <p className="mb-1 text-sm text-gray-400">
                        <span className="font-semibold text-white">Click to upload</span>
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG (MAX 5MB)</p>
                    </div>
                    <input type="file" name="image" accept="image/*" className="hidden" />
                  </label>
                ) : (
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <i className="fas fa-link"></i>
                    </span>
                    <input
                      type="url"
                      value={formData.image_url || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Description <span className="text-green-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute top-3 left-3 text-gray-500">
                    <i className="fas fa-align-left"></i>
                  </span>
                  <textarea
                    required
                    rows={4}
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all resize-none"
                    placeholder="Briefly describe what you studied and key learnings..."
                  ></textarea>
                </div>
              </div>

              {savingStatus && (
                <div className="text-center text-sm text-red-400 mt-2">{savingStatus}</div>
              )}

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg shadow-green-900/40 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-save"></i>
                  <span>Save Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default About;
