import { CartProvider } from "../context/cartContext.js";
import Navbar from "../components/Navbar"; // Keep Navbar for navigation
import "../app/globals.css"; // Ensure this is correct

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar /> {/* Keeping Navbar without dark mode */}
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
