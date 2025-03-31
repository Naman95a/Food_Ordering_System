"use client";

import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Email & Password Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (user) {
      // Insert user details into "users" table
      const { error: insertError } = await supabase.from("users").insert([
        { id: user.id, name: formData.name, email: formData.email },
      ]);

      if (insertError) console.error("Error inserting user data:", insertError.message);
    }

    alert("Signup successful! Check your email for confirmation.");
    router.push("/login");
    setLoading(false);
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }, // Redirect to home page
    });
  
    if (error) {
      setError(error.message);
      console.error("Google Sign-In Error:", error.message);
    }
  };
  
  

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{
      backgroundImage: "url('/loginbg.png')",
      height: '100vh',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>
      <motion.div 
        className="relative p-8 rounded-2xl shadow-2xl w-full max-w-md text-white border border-gray-500 bg-gray-900 bg-opacity-20 backdrop-blur-md"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold text-center mb-6 text-green-400">Sign Up</h1>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-6">
          <input 
            type="text" 
            placeholder="Name" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            required 
            className="w-full p-3 rounded-lg bg-gray-800 bg-opacity-50 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-300"
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            required 
            className="w-full p-3 rounded-lg bg-gray-800 bg-opacity-50 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-300"
          />
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={formData.password} 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              required 
              className="w-full p-3 rounded-lg bg-gray-800 bg-opacity-50 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-300"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="flex items-center justify-center my-4">
          <hr className="w-full border-gray-500" />
          <span className="px-2 text-gray-400">or</span>
          <hr className="w-full border-gray-500" />
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md flex items-center justify-center space-x-3"
        >
          <img src="/google.png" alt="Google" className="w-5 h-5" />
          <span>Sign in with Google</span>
        </button>

        <p className="text-center text-gray-300 mt-4">
          Already have an account? 
          <a href="/login" className="text-green-400 hover:underline ml-1">Login</a>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
