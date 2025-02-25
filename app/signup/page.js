"use client";

import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      console.error("Signup error:", error.message);
      return;
    }

    // Insert user details into "users" table
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: data.user.id, // User ID from Supabase Auth
        name: formData.name,
        email: formData.email,
      },
    ]);

    if (insertError) {
      console.error("Error inserting user data:", insertError.message);
    }

    alert("Signup successful!");
    router.push("/login"); // Redirect to login page
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default SignupPage;
