import AdminLayoutWrapper from "@/components/admin-view/AdminLayoutWrapper";
export const metadata = {
  title: "Jewellery Dashboard",
  description: "Dashboard for Jewellery Shop for Admins",
};
function AdminLayout({ children }) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}

export default AdminLayout;
