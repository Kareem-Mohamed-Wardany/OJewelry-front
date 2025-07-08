import StoreProvider from "./StoreProvider";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Jewellery Shop",
  description:
    "Jewellery Shop here you can find all things related to Jewellery",
};
export default function RootLayout({ children }) {
  return (
    <StoreProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased `}
        >
          {children}
          <ToastContainer position="bottom-center" />
        </body>
      </html>
    </StoreProvider>
  );
}
