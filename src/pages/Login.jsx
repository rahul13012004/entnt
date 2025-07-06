import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockUsers } from "../utils/storage";
import loginPic from "../styles/LoginPic.jpeg"; // place your image in /src/assets
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
  
      
      window.dispatchEvent(new Event("storage"));
  
      navigate(user.role === "Admin" ? "/dashboard" : "/patients");
    } else {
      alert("Invalid credentials");
    }
  };
  
  return (
    <div className="login-fullscreen">
      <img src={loginPic} alt="Login Background" className="login-bg" />
      <div className="login-overlay">
        <form className="login-box" onSubmit={(e) => e.preventDefault()}>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" onClick={handleLogin}>Login</button>
        </form>
      </div>
    </div>
  );
}
