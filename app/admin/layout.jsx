import AdminLayoutWrapper from "@/components/admin-view/AdminLayoutWrapper";
export const metadata = {
  title: "O Jewelry Dashboard",
  description: "Dashboard for O Jewelry Shop for Admins",
};
function AdminLayout({ children }) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}

export default AdminLayout;
