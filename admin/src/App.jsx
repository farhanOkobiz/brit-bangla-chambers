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
import ContactMessage from "../components/request/ContactMessage";
// import Users from "../pages/Admin/Users";
import Users from "../pages/Admin/Users";
import ServiceForm from "../components/Admin/ServiceForm";
import AdvocateForm from "../components/Admin/AdvocateForm";
import AdvocateShowcase from "../components/Admin/AdvocateShowcase";
import ShowIndividualAdvocate from "../components/Admin/ShowIndividualAdvocate";
import EditBlog from "../pages/blog/EditBlog";
import AdvocateManagement from "../components/AdvocateManagement";
import UserManagement from "../components/Users/UserManagement";
import AdvocateProfile from "../components/Advocate/AdvocateProfile";
// import CreateUserFile from "../pages/my_cases/CreateUserFile";
import AllCaseFile from "../pages/my_cases/AllCaseFile";
import RequestForAdvocate from "../components/request/RequestForAdvocate";
import RequestForService from "../components/request/RequestForService";
// import EditAdvocateGeneralInfo from "../components/Admin/EditAdvocateGeneralInfo";
import AdvocateFileRequestForm from "../components/Advocate/AdvocateFileRequestForm";

import AdvocateUpdate from "../components/Admin/AdvocateUpdate";
import CreateAdvocate from "../components/Admin/CreateAdvocate";
import EditCaseFile from "../pages/my_cases/EditCaseFile";
import DetailsFile from "../pages/my_cases/DetailsFile";
import AdminAllCaseFile from "../pages/Admin/admin_case_file/AdminAllCaseFile";
import AdminSettings from "../components/Settings/AdminSettings";
import AdvocateSettings from "../components/Settings/AdvocateSettings";
import AdminDetailsCaseFile from "../pages/Admin/admin_case_file/AdminDetailsCaseFile";
import CaseDetails from "../components/Advocate/CaseDetails";
import DetailsBlog from "../pages/blog/DetailsBlog";

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
          <Route path="dashboard/edit-blog/:id" element={<EditBlog />} />
          <Route path="dashboard/details-blog/:id" element={<DetailsBlog />} />
          <Route path="dashboard/request" element={<RequestForAdvocate />} />
          <Route path="dashboard/all-case-file" element={<AllCaseFile />} />
          <Route
            path="dashboard/detail-case-file/:id"
            element={<DetailsFile />}
          />
          <Route
            path="dashboard/edit-case-file/:id"
            element={<EditCaseFile />}
          />
          <Route
            path="dashboard/request-file/:id"
            element={<AdvocateFileRequestForm />}
          />
          <Route path="/advocate/settings" element={<AdvocateSettings />} />
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
          <Route path="advocates/showcase" element={<AdvocateShowcase />} />
          <Route path="advocates/:id" element={<ShowIndividualAdvocate />} />
          <Route path="advocates/:id/edit" element={<AdvocateUpdate />} />
          <Route path="advocates/management" element={<AdvocateManagement />} />
          <Route path="messages/contact" element={<ContactMessage />} />
          <Route path="messages/service" element={<RequestForService />} />
          <Route path="users" element={<Users />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="dashboard/blogs" element={<Blogs />} />
          <Route path="dashboard/create-blog" element={<CreateBlog />} />
          <Route path="dashboard/edit-blog/:id" element={<EditBlog />} />
          <Route path="dashboard/details-blog/:id" element={<DetailsBlog />} />
          <Route path="case-file" element={<AdminAllCaseFile />} />
          <Route
            path="detail-case-file/:id"
            element={<AdminDetailsCaseFile />}
          />
          <Route path="/admin/advocates/create" element={<CreateAdvocate />} />
          <Route path="/admin/Settings" element={<AdminSettings />} />

          {/* Add more child routes here as needed */}
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
