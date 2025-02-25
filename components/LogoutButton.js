"use client";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        alert("Logged out successfully!");
        router.push("/login");
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
