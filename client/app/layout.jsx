// app/layout.js

import "./globals.css"; // Import global styles (Tailwind CSS)
import { Inter, Montserrat } from "next/font/google"; // Import Google Fonts

// Import the common components

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${montserrat.className}`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
