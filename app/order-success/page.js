"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import Confetti to avoid SSR issues
const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

const OrderSuccessContent = () => {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isClient, setIsClient] = useState(false); // Check if running on client

  useEffect(() => {
    setIsClient(true); // Mark that we are on client

    setShowConfetti(true); // Start confetti effect

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timer = setTimeout(() => {
      setShowConfetti(false);
      router.push("/my-orders");
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0d0d0d] text-white text-center relative overflow-hidden">
      {/* Only render Confetti if in client */}
      {isClient && showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} />
      )}

      {/* Neon Glow Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 opacity-20 blur-2xl"></div>

      {/* Order Confirmation Card */}
      <div className="relative bg-[#1a1a1a] bg-opacity-80 backdrop-blur-lg p-10 rounded-2xl shadow-xl border border-gray-700 animate-fadeIn transition-all transform hover:scale-105">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 animate-bounce">
          🎉 Order Placed Successfully! 🎉
        </h1>

        <p className="text-gray-400 mt-2">
          Redirecting to <span className="text-blue-300">My Orders</span> in
          <span className="text-green-300 text-2xl font-bold animate-pulse"> {countdown}s...</span>
        </p>

        {/* Fun Emoji Button */}
        <button 
          onClick={() => router.push("/my-orders")}
          className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg transform transition hover:scale-110 animate-pulse"
        >
          🚀 Go to My Orders
        </button>
      </div>

      {/* Floating Sparkles Effect */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 opacity-50 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute top-10 right-10 w-24 h-24 bg-blue-500 opacity-50 blur-3xl rounded-full animate-ping"></div>
    </div>
  );
};

const OrderSuccess = () => (
  <Suspense fallback={<p>Loading...</p>}>
    <OrderSuccessContent />
  </Suspense>
);

export default OrderSuccess;
