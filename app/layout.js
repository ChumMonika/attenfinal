// 1. Import the 'Inter' font from next/font/google
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '../contexts/AuthContext';

// 2. Initialize the Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "University Attendance System",
  description: "A modern system for tracking staff attendance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 3. Apply the Inter font's className to the body */}
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
