"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import Confetti to avoid SSR issues
const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

const OrderSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
      router.push("/my-orders"); // Redirect after 10 seconds
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 text-center">
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-green-600">🎉 Order Placed Successfully! 🎉</h1>
        <p className="mt-4 text-lg">Your order ID is <strong>{orderId}</strong></p>
        <p className="text-gray-600 mt-2">You will be redirected to 'My Orders' shortly...</p>
      </div>
    </div>
  );
};

const OrderSuccess = () => (
  <Suspense fallback={<p>Loading...</p>}>
    <OrderSuccessContent />
  </Suspense>
);

export default OrderSuccess;
