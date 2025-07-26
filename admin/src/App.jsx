import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminPanel from "../pages/AdminPanel";
import AdvocatePanel from "../pages/AdvocatePanel";
import Unauthorized from "../components/Unauthorized";
import ProtectedRoute from "../auth/ProtectedRoute";
import SpecializationForm from "../components/SpecializationForm";
import SubcategoryForm from "../components/subCategoryForm";
import AdminDashboard from "../components/AdminDashboard";
import AdvocateDashboard from "../components/AdvocateDashboard";
import Blogs from "../pages/blog/Blogs";
import CreateBlog from "../pages/blog/CreateBlog";
import ContactMessage from "../components/message/ContactMessage";
import RequestMessage from "../components/message/RequestMessage";
// import Users from "../pages/Admin/Users";
import Users from "../pages/Admin/Users";
import ServiceForm from "../components/ServiceForm";
import AdvocateForm from "../components/AdvocateForm";
import EditBlog from "../pages/blog/EditBlog";
import AdvocateManagement from "../components/AdvocateManagement";
import UserManagement from "../components/Users/UserManagement";
import AdvocateProfile from "../components/Advocate/AdvocateProfile";
import MyCases from "../pages/my_cases/MyCases";
import CreateUserFile from "../pages/my_cases/CreateUserFile";
import AllUserFile from "../pages/my_cases/AllUserFile";
import EditUserFile from "../pages/my_cases/EditUserFile";
import RequestForAdvocate from "../components/request/RequestForAdvocate";
import RequestForService from "../components/request/RequestForService";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/advocate"
          element={
            <ProtectedRoute requiredRole="advocate">
              <AdvocatePanel />
            </ProtectedRoute>
          }
        >
          <Route path="/advocate/profile" element={<AdvocateProfile />} />
          <Route path="dashboard" element={<AdvocateDashboard />} />
          <Route path="dashboard/blogs" element={<Blogs />} />
          <Route path="dashboard/create-blog" element={<CreateBlog />} />
          <Route path="dashboard/request" element={<RequestForAdvocate />} />
          <Route path="dashboard/accepted-cases" element={<MyCases />} />
          <Route path="dashboard/all-user-file" element={<AllUserFile />} />
          <Route
            path="dashboard/create-user-file"
            element={<CreateUserFile />}
          />
          <Route
            path="dashboard/edit-user-file/:id"
            element={<EditUserFile />}
          />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="specialization" element={<SpecializationForm />} />
          <Route path="sub-categories" element={<SubcategoryForm />} />
          <Route path="services" element={<ServiceForm />} />
          <Route path="advocates" element={<AdvocateForm />} />
          <Route path="advocates/management" element={<AdvocateManagement />} />
          <Route path="messages/contact" element={<ContactMessage />} />
          <Route path="messages/service" element={<RequestForService />} />
          <Route path="users" element={<Users />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="dashboard/blogs" element={<Blogs />} />
          <Route path="dashboard/create-blog" element={<CreateBlog />} />
          <Route path="dashboard/blogs/edit-blog/:id" element={<EditBlog />} />

          {/* Add more child routes here as needed */}
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
