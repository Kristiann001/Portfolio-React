import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import HireModal from "./components/HireModal";
import Home from "./pages/Home";
import About from "./pages/About";
import Achievements from "./pages/Achievements";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";

function App() {
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Sidebar onHireClick={() => setIsHireModalOpen(true)} />
        <Routes>
          <Route path="/" element={<Home onHireClick={() => setIsHireModalOpen(true)} />} />
          <Route path="/about" element={<About />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <MobileNav />
        <HireModal
          isOpen={isHireModalOpen}
          onClose={() => setIsHireModalOpen(false)}
        />
      </div>
    </Router>
  );
}

export default App;
