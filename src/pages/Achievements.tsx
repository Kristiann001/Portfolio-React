import { useState, useEffect, useCallback, useRef } from "react";
import Swal from "sweetalert2";
import { supabase } from "../utils/supabase";
import PdfPreview from "../components/PdfPreview";

interface Achievement {
  id: string;
  title: string;
  description: string;
  image: string;
  file_name?: string;
  certification?: string;
}

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageType: "url", // defaulting to URL for simplicity
    imageUrl: "",
    certType: "url",
    certificationUrl: "",
  });
  const [status, setStatus] = useState("");
  const [statusColor, setStatusColor] = useState("text-white");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const imageFileRef = useRef<HTMLInputElement>(null);
  const certFileRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [certPreview, setCertPreview] = useState<{ url: string; isPdf: boolean; name: string } | null>(null);

  const loadAchievements = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setAchievements(data || []);
    } catch {
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  const filteredAchievements = achievements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()),
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
      const ach = achievements.find((a) => a.id === id);
      if (ach) {
        setFormData({
          title: ach.title,
          description: ach.description,
          imageType: "url",
          imageUrl: ach.image || "",
          certType: "url",
          certificationUrl: ach.certification || "",
        });
      }
    } else {
      setFormData({
        title: "",
        description: "",
        imageType: "url",
        imageUrl: "",
        certType: "url",
        certificationUrl: "",
      });
    }
    setStatus("");
    setImagePreview(null);
    setCertPreview(null);
    setModalOpen(true);
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple frontend verification for demo
    const secretPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'acemiano001';
    
    if (adminPassword === secretPassword) {
      setIsAdminVerified(true);
      setAdminModalOpen(false);
      setAdminPassword("");
      showForm(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, description } = formData;

    if (!title || !description) {
      setStatus("Title and description are required");
      setStatusColor("text-red-400");
      return;
    }

    setStatus("Saving...");
    setStatusColor("text-white");

    let finalImageUrl = formData.imageUrl;
    let finalCertUrl = formData.certificationUrl;
    let fileName = "";

    const readAsBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

    try {
      // 1. Handle Image Upload — convert to base64, store in DB
      if (formData.imageType === "file") {
        const fileInput = imageFileRef.current;
        if (fileInput && fileInput.files && fileInput.files[0]) {
          const file = fileInput.files[0];
          fileName = file.name;
          try {
            finalImageUrl = await readAsBase64(file);
          } catch {
            setStatus("Failed to read image file.");
            setStatusColor("text-red-400");
            return;
          }
        }
      }

      // 2. Handle Certification Upload — convert to base64, store in DB
      if (formData.certType === "file") {
        const fileInput = certFileRef.current;
        if (fileInput && fileInput.files && fileInput.files[0]) {
          const file = fileInput.files[0];
          try {
            finalCertUrl = await readAsBase64(file);
          } catch {
            setStatus("Failed to read certificate file.");
            setStatusColor("text-red-400");
            return;
          }
        }
      }

      const achievementData = {
        title,
        description,
        image: finalImageUrl,
        certification: finalCertUrl,
        file_name: fileName || undefined
      };

      if (editingId) {
        const { error } = await supabase
          .from('achievements')
          .update(achievementData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('achievements')
          .insert([achievementData]);
        if (error) throw error;
      }

      Swal.fire({
        icon: "success",
        title: editingId ? "Achievement updated!" : "Achievement added!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#2b2b2d",
        color: "#ffffff",
      });

      setModalOpen(false);
      loadAchievements();
    } catch (err) {
      console.error(err);
      setStatus("Failed to save. Please try again.");
      setStatusColor("text-red-400");
    }
  };

  const deleteAchievement = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "#2b2b2d",
      color: "#ffffff",
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from('achievements').delete().eq('id', id);
        if (error) throw error;
        
        loadAchievements();
        Swal.fire({
          title: "Deleted!",
          text: "The achievement has been deleted.",
          icon: "success",
          background: "#2b2b2d",
          color: "#ffffff",
          confirmButtonColor: "#16a34a",
        });
      } catch {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete achievement.",
          icon: "error",
          background: "#2b2b2d",
          color: "#ffffff",
          confirmButtonColor: "#16a34a",
        });
      }
    }
  };

  return (
    <main className="lg:ml-72 p-6 sm:p-8 md:p-10 lg:p-12 min-h-screen bg-[#2b2b2d] text-white pb-24 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none"></div>
      <section className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-row justify-between items-start sm:items-end gap-4 sm:gap-6 mb-6">
          <div className="flex-1">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-yellow-200 to-[#D4AF37] drop-shadow-sm mb-2">
              Achievements.
            </h2>
            <p className="text-[#D4AF37] font-bold tracking-widest uppercase text-xs sm:text-sm">Milestones & Certifications</p>
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
            A curated collection of professional certifications and badges I have earned. 
            These milestones represent my unwavering commitment to continuous learning and mastery of modern technologies.
          </p>
          <div className="w-full lg:w-auto flex gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search awards..."
                className="w-full pl-10 pr-4 py-2 bg-[#3a3a3c] border border-white/10 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            {isAdminVerified && (
              <button
                onClick={() => openModal()}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition whitespace-nowrap"
              >
                <i className="fas fa-plus mr-2"></i>Add Achievement
              </button>
            )}
          </div>
        </div>

        <hr className="border-t border-white/20 mb-12" />

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            <p className="mt-4 text-white/70">Loading achievements...</p>
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-trophy text-6xl text-gray-500 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">No Achievements Yet</h3>
            <p className="text-white/70 mb-6">
              {isAdminVerified ? "Add your first achievement to showcase your accomplishments!" : "Check back later for updates."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAchievements.map((ach, index) => {
              const isPDF = ach.certification && (
                ach.certification.toLowerCase().endsWith(".pdf") ||
                ach.certification.startsWith("data:application/pdf")
              );
              
              return (
                <div
                  key={ach.id}
                  className="relative group bg-[#1e1e20] border border-white/10 rounded-2xl overflow-hidden hover:shadow-[0_10px_40px_-10px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]/30 transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Cert Image (Banner) */}
                  <div className="h-40 w-full relative overflow-hidden bg-[#2b2b2d]">
                    {ach.certification && !isPDF ? (
                      <img
                        src={ach.certification}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        alt="Certificate"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : isPDF ? (
                      <PdfPreview src={ach.certification!} className="w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <i className="fas fa-certificate text-[#D4AF37] text-4xl mb-2 opacity-30 group-hover:opacity-60 transition-opacity"></i>
                        <span className="text-xs text-gray-500 tracking-widest uppercase">No Certificate</span>
                      </div>
                    )}
                    {/* Golden Certified Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold tracking-widest uppercase rounded-full flex items-center gap-1.5 shadow-lg z-20">
                      <i className="fas fa-check-circle"></i>
                      Certified
                    </div>
                    {/* Bottom overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e20] via-transparent to-transparent z-10"></div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 relative pt-2">
                    <div className="flex items-start gap-4 mb-4">
                      {/* School Image (Thumbnail) */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-[#D4AF37]/30 flex-shrink-0 shadow-xl relative -mt-10 z-20">
                        <img
                          src={ach.image || "https://placehold.co/100x100/ffffff/999999?text=Logo"}
                          className="w-full h-full object-contain"
                          alt="School Logo"
                        />
                      </div>
                      
                      {/* Name of Course */}
                      <div className="flex-1 mt-1">
                        <h3 className="text-lg font-bold text-white leading-tight group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                          {ach.title}
                        </h3>
                      </div>
                    </div>

                    {/* Issued Date Pill & Actions */}
                    <div className="flex items-center justify-between mt-6 border-t border-white/5 pt-4">
                      {/* Issued Date Pill */}
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-medium">
                        <i className="far fa-calendar-alt"></i>
                        <span>{ach.description || "No Date provided"}</span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {isAdminVerified && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(ach.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                              title="Edit"
                            >
                              <i className="fas fa-pen text-xs"></i>
                            </button>
                            <button
                              onClick={() => deleteAchievement(ach.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                              title="Delete"
                            >
                              <i className="fas fa-trash text-xs"></i>
                            </button>
                          </div>
                        )}
                        {ach.certification && (
                          <a
                            href={ach.certification}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                            title="View Document"
                          >
                            <i className="fas fa-external-link-alt text-xs"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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

      {/* Achievement Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-all duration-300">
          <div className="bg-[#1e1e20]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-green-500/10 w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <i className="fas fa-times"></i>
            </button>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {editingId ? "Edit Achievement" : "Add Achievement"}
              </h2>
              <p className="text-gray-400 text-sm">
                Showcase your awards and certificates
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label
                  className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2"
                  htmlFor="ach-title"
                >
                  Name of course <span className="text-green-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <i className="fas fa-trophy"></i>
                  </span>
                  <input
                    type="text"
                    id="ach-title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all font-medium"
                    placeholder="e.g., Full-Stack Web Development"
                  />
                </div>
              </div>
              <div className="mb-5">
                <label
                  className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2"
                  htmlFor="ach-description"
                >
                  Issued <span className="text-green-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <i className="fas fa-calendar-alt"></i>
                  </span>
                  <input
                    type="text"
                    id="ach-description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all font-medium"
                    placeholder="e.g., August 2024"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  School Image
                </label>
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
                    <span className="block py-2 rounded-md text-sm font-medium text-gray-400 peer-checked:bg-[#2b2b2d] peer-checked:text-white peer-checked:shadow-sm transition-all text-white">
                      Upload
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
                    <span className="block py-2 rounded-md text-sm font-medium text-gray-400 peer-checked:bg-[#2b2b2d] peer-checked:text-white peer-checked:shadow-sm transition-all text-white">
                      URL
                    </span>
                  </label>
                </div>

                {formData.imageType === "file" ? (
                  <>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-green-500/50 hover:bg-black/20 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <i className="fas fa-cloud-upload-alt text-2xl text-gray-500 group-hover:text-green-500 mb-2 transition-colors"></i>
                        <p className="mb-1 text-sm text-gray-400">
                          <span className="font-semibold text-white">Click to upload</span>{" "}or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG (MAX. 10MB)</p>
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
                        <img src={imagePreview} alt="Preview" className="w-14 h-14 rounded-lg object-contain bg-white p-1" />
                        <div>
                          <p className="text-xs font-bold text-green-400">✓ Logo ready to upload</p>
                          <p className="text-xs text-gray-500 mt-0.5">Saved when you click Save Record</p>
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
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                      placeholder="https://example.com/certificate.jpg"
                    />
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Cert Image (Document or Image)
                </label>
                <div className="flex p-1 bg-black/40 rounded-lg mb-3">
                  <label className="flex-1 text-center cursor-pointer">
                    <input
                      type="radio"
                      name="certType"
                      value="file"
                      checked={formData.certType === "file"}
                      onChange={(e) =>
                        setFormData({ ...formData, certType: e.target.value })
                      }
                      className="peer hidden"
                    />
                    <span className="block py-2 rounded-md text-sm font-medium text-gray-400 peer-checked:bg-[#2b2b2d] peer-checked:text-white peer-checked:shadow-sm transition-all text-white">
                      Upload
                    </span>
                  </label>
                  <label className="flex-1 text-center cursor-pointer">
                    <input
                      type="radio"
                      name="certType"
                      value="url"
                      checked={formData.certType === "url"}
                      onChange={(e) =>
                        setFormData({ ...formData, certType: e.target.value })
                      }
                      className="peer hidden"
                    />
                    <span className="block py-2 rounded-md text-sm font-medium text-gray-400 peer-checked:bg-[#2b2b2d] peer-checked:text-white peer-checked:shadow-sm transition-all text-white">
                      URL
                    </span>
                  </label>
                </div>

                {formData.certType === "file" ? (
                  <>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-green-500/50 hover:bg-black/20 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <i className="fas fa-file-contract text-2xl text-gray-500 group-hover:text-green-500 mb-2 transition-colors"></i>
                        <p className="mb-1 text-sm text-gray-400">
                          <span className="font-semibold text-white">Click to upload certification</span>
                        </p>
                        <p className="text-xs text-gray-500">PDF, Images (MAX. 10MB)</p>
                      </div>
                      <input
                        type="file"
                        name="certification"
                        accept="image/*, .pdf"
                        className="hidden"
                        ref={certFileRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const isPdf = file.type === 'application/pdf';
                            const reader = new FileReader();
                            reader.onload = () => setCertPreview({ url: reader.result as string, isPdf, name: file.name });
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {certPreview && (
                      <div className="mt-3 flex items-center gap-3 p-3 bg-black/30 rounded-xl border border-[#D4AF37]/30">
                        {certPreview.isPdf ? (
                          <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-400/20 flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-file-pdf text-xl text-red-400"></i>
                          </div>
                        ) : (
                          <img src={certPreview.url} alt="Cert Preview" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#D4AF37]">✓ {certPreview.isPdf ? 'PDF' : 'Image'} ready to upload</p>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{certPreview.name}</p>
                        </div>
                        <button type="button" onClick={() => { setCertPreview(null); if (certFileRef.current) certFileRef.current.value = ''; }} className="ml-auto text-gray-500 hover:text-red-400 transition-colors flex-shrink-0">
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
                      value={formData.certificationUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          certificationUrl: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                      placeholder="https://example.com/certification.pdf"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-500 hover:to-green-400 transition-all shadow-lg shadow-green-900/40 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-save"></i>
                  <span>Save Achievement</span>
                </button>
              </div>
              {status && (
                <p className={`mt-4 text-center ${statusColor}`}>{status}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Achievements;
