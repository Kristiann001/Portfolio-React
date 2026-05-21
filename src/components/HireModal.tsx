import { useState } from "react";

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HireModal = ({ isOpen, onClose }: HireModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [statusColor, setStatusColor] = useState("text-white");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, subject, message } = formData;

    if (!email || !message) {
      setStatus("Email and message required");
      setStatusColor("text-red-400");
      return;
    }

    setStatus("Sending...");
    setStatusColor("text-white");

    try {
      const res = await fetch("http://localhost:5000/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Anonymous",
          email,
          subject,
          message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("Message sent! I'll get back to you soon.");
        setStatusColor("text-green-400");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error();
      }
    } catch {
      setStatus("Error sending. Email me directly.");
      setStatusColor("text-red-400");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-all duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#1e1e20]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-green-500/10 w-full max-w-lg p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
        >
          <i className="fas fa-times"></i>
        </button>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Get in Touch</h2>
          <p className="text-gray-400 text-sm">
            Have a project in mind? Let's talk!
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2"
              htmlFor="hire-name"
            >
              Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <i className="fas fa-user"></i>
              </span>
              <input
                type="text"
                id="hire-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all font-medium"
                placeholder="Your name (optional)"
              />
            </div>
          </div>
          <div className="mb-5">
            <label
              className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2"
              htmlFor="hire-email"
            >
              Email <span className="text-green-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                type="email"
                id="hire-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all font-medium"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div className="mb-5">
            <label
              className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2"
              htmlFor="hire-subject"
            >
              RE / Subject
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <i className="fas fa-tag"></i>
              </span>
              <input
                type="text"
                id="hire-subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all font-medium"
                placeholder="e.g., Job Opportunity"
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2"
              htmlFor="hire-message"
            >
              Message <span className="text-green-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-gray-500">
                <i className="fas fa-comment-alt"></i>
              </span>
              <textarea
                id="hire-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all resize-none"
                placeholder="Tell me about the opportunity or project..."
              ></textarea>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-500 hover:to-green-400 transition-all shadow-lg shadow-green-900/40 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <i className="fas fa-paper-plane"></i>
              <span>Send Message</span>
            </button>
          </div>
          <p className={`mt-4 text-center ${statusColor}`}>{status}</p>
        </form>
      </div>
    </div>
  );
};

export default HireModal;
