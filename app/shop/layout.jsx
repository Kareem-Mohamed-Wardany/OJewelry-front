import ShoppingHeader from "@/components/shopping-view/header";
import Footer from "@/components/shopping-view/Footer";
export const metadata = {
  title: "Jewellery Shop",
  description:
    "Jewellery Shop here you can find all things related to Jewellery",
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
