import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import "./App.css";

const ResumePreview = React.forwardRef(({ data, theme }, ref) => {
  return (
    <div ref={ref} className={`preview-section ${theme}`}>
      <h2>Resume</h2>
      <p><strong>Name:</strong> <span>{data.name}</span></p>
      <p><strong>Email:</strong> <span>{data.email}</span></p>
      <p><strong>Phone:</strong> <span>{data.phone}</span></p>
      <p><strong>Skills:</strong> <span>{data.skills}</span></p>
      <p><strong>Experience:</strong> <span>{data.experience}</span></p>
      <p><strong>Education:</strong> <span>{data.education}</span></p>

      {data.linkedin && (
        <p><strong>LinkedIn:</strong> <a href={data.linkedin} target="_blank" rel="noreferrer">{data.linkedin}</a></p>
      )}
      {data.github && (
        <p><strong>GitHub:</strong> <a href={data.github} target="_blank" rel="noreferrer">{data.github}</a></p>
      )}
    </div>
  );
});

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
    education: "",
    linkedin: "",
    github: "",
  });

  const [theme, setTheme] = useState("light");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // ✅ Backend-connected AI suggestion function
  const generateSuggestion = async () => {
    setLoading(true);
    setSuggestion("Thinking...");

    try {
      const response = await axios.post("http://localhost:5000/api/suggest", formData);
      setSuggestion(response.data.suggestion);
    } catch (error) {
      console.error(error);
      setSuggestion("❌ Error: Could not fetch AI suggestion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-grid">
      <div className="form-section">
        <h2>Fill Your Resume</h2>

        <select onChange={(e) => setTheme(e.target.value)} className="theme-selector">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="blue">Blue</option>
        </select>

        <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        <input type="text" placeholder="Phone No" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
        <textarea placeholder="Skills" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })}></textarea>
        <textarea placeholder="Experience" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })}></textarea>
        <textarea placeholder="Education" value={formData.education} onChange={(e) => setFormData({ ...formData, education: e.target.value })}></textarea>
        <input type="text" placeholder="LinkedIn URL" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
        <input type="text" placeholder="GitHub URL" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} />

        <button onClick={handlePrint} className="download-btn">Download PDF</button>
        <button onClick={generateSuggestion} className="suggest-btn">
          {loading ? "Generating..." : "Suggest Improvements"}
        </button>

        {suggestion && (
          <div className="suggestion-box">
            <h3>AI Suggestions</h3>
            <pre>{suggestion}</pre>
          </div>
        )}
      </div>

      <ResumePreview ref={componentRef} data={formData} theme={theme} />
    </div>
  );
}

export default App;
