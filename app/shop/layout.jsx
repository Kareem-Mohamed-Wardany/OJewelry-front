import ShoppingHeader from "@/components/shopping-view/header";
import Footer from "@/components/shopping-view/Footer";
export const metadata = {
  title: "O Jewelry Shop",
  description: "O Jewelry Shop here you can find all things related to Jewelry",
};

export default function RootLayout({ children }) {
  return (
    <>
      <ShoppingHeader />
      {children}
      <Footer />
    </>
  );
}
