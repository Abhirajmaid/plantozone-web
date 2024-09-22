// app/layout.js

import "./globals.css"; // Import global styles (Tailwind CSS)
import { Playfair, Montserrat } from "next/font/google"; // Import Google Fonts

// Import the common components

const playfair = Playfair({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.className} ${montserrat.className}`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
