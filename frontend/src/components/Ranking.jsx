import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import authApi from "../api_sevices/auth";

export default function LevelSelect() {
  const [level, setLevel] = useState(null);
  const navigate = useNavigate();
  
  // 1. Get credentials passed from Signup page
  const location = useLocation();
  const { username, password } = location.state || {};

  // 2. Protect the route: Redirect to signup if no credentials found
  useEffect(() => {
    if (!username || !password) {
      // Optional: alert check can be removed if you want silent redirect
      // alert("Please enter details first");
      navigate("/signup");
    }
  }, [username, password, navigate]);

  const levels = [
    {
      label: "Beginner",
      value: "beginner",
      desc: "New to problem solving",
      emoji: "🌱",
      color: "from-green-400 to-green-600",
    },
    {
      label: "Medium",
      value: "medium",
      desc: "Comfortable with basics",
      emoji: "🔥",
      color: "from-yellow-400 to-orange-500",
    },
    {
      label: "Advanced",
      value: "advanced",
      desc: "Strong DSA & algorithms",
      emoji: "🚀",
      color: "from-purple-500 to-indigo-600",
    },
  ];

  const handleContinue = async () => {
    // Prevent continue if no level selected
    if (!level) return;
    
    // Double check credentials
    if (!username || !password) {
        navigate("/signup");
        return;
    }

    try {
      // 3. Finalize Signup: Send username, password AND ranking
      const res = await authApi.signup({
        username,
        password,
        ranking: level
      });
      
      const data = res.data;

      // Handle "User already exists" case if backend returns it as 200 OK
      if (data.message === "User already exists") {
        alert("User already exists");
        navigate("/login");
        return;
      }

      // Save token and navigate
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        navigate("/problems");
      }
      
    } catch (error) {
      console.error("Signup failed:", error);
      // Optional: Show error to user
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--primary)]">
      <div className="bg-[var(--secondary)] p-10 rounded-3xl shadow-2xl max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-10 text-[var(--text-primary)]">
          Choose Your Level
        </h1>
        
        {/* LEVEL CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {levels.map((l) => (
            <button
              key={l.value}
              onClick={() => setLevel(l.value)}
              className={`relative p-6 rounded-2xl text-left text-white
                transition-all duration-200
                hover:scale-105 hover:shadow-xl
                focus:outline-none focus:ring-4 focus:ring-black/20
                bg-gradient-to-br ${l.color}
                ${
                  level === l.value
                    ? "ring-4 ring-black scale-105"
                    : "opacity-90"
                }
              `}
            >
              <div className="text-5xl mb-4">{l.emoji}</div>
              <div className="text-xl font-bold">{l.label}</div>
              <div className="text-sm opacity-90 mt-2">{l.desc}</div>

              {level === l.value && (
                <div className="absolute top-3 right-3 bg-[var(--accent-green)] text-[var(--text-primary)] text-xs px-3 py-1 rounded-full font-semibold shadow">
                  Selected
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!level}
          className="
            w-full mt-10 py-4 rounded-xl text-lg font-semibold text-white
            bg-[var(--tertiary)]
            hover:bg-[var(--tertiary-hover)]
            disabled:bg-[var(--tertiary-disabled)]
            disabled:cursor-not-allowed
            transition-all duration-200
            hover:scale-[1.02]
            focus:outline-none focus:ring-4 focus:ring-blue-300
          "
        >
          Continue
        </button>
      </div>
    </div>
  );
}