import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import "./App.css";

import HomePage from "./pages/HomePage";
import Register from "./pages/Register";
import LogIn from "./pages/LogIn";

import VerticalNav from "./pages/VerticalNav";
import Dashboard from "./pages/Student/Dashboard";
import CourseCatalog from "./pages/Student/CourseCatalog";
import CoursePlayer from "./pages/Student/CoursePlayer";
import Quiz from "./pages/Student/Quiz";
import QuizResult from "./pages/Student/QuizResult";
import Grandes from "./pages/Student/Grandes";
import Assigmnent from "./pages/Student/Assigmnent";
import Forum from "./pages/Student/Forum";
import Certificate from "./pages/Student/Certificate";


import DashboardIns from "./pages/instructor/Dashboard";
import CreateCourse from "./pages/instructor/CreateCourse";
import Curriculum from "./pages/instructor/Curriculum";
import EditCourse from "./pages/instructor/EditCourse";
import StudentList from "./pages/instructor/StudentList";
import CourseAnalytics from "./pages/instructor/CourseAnalytics";
import ForumIns from "./pages/instructor/Forum";

import DashboardAdm from "./pages/Admin/Dashbourd";
import Categories_Tags from "./pages/Admin/Categories_Tags";
import CourseManagement from "./pages/Admin/CourseManagement";
import InstructorApprovals from "./pages/Admin/InstructorApprovals";
import Reports from "./pages/Admin/Reports";
import Usermanagement from "./pages/Admin/Usermanagement";
import CourseDetails from "./pages/Student/CourseDetails";

function ProtectedLayout({ allowedRoles, onLogout }) {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role.toLowerCase())) {
    return <Navigate to="/403" replace />;
  }

  return (
    <div className="app-layout">
      <VerticalNav onLogout={onLogout} />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}


function PlaceholderPage({ title }) {
  return (
    <div style={{
      padding: "2rem",
      fontFamily: "DM Sans, sans-serif",
      color: "#1a1814",
    }}>
      <h2 style={{ fontFamily: "DM Serif Display, serif", fontWeight: 400 }}>
        {title}
      </h2>
      <p style={{ color: "#a9a9a9", fontSize: 14 }}>
        This page is under construction.
      </p>
    </div>
  );
}


function NotFound() {
  return <PlaceholderPage title="404 — Page not found" />;
}

function Forbidden() {
  return <PlaceholderPage title="403 — Access denied" />;
}


///////////////////////////////////////////////////////////////////////
function App() {

  

  const [token, setToken] = useState(() => localStorage.getItem("token"));
const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem("user")));
const role = currentUser?.role?.toLowerCase();



const handleLoginSuccess = (newToken, userData) => {
  localStorage.setItem("token", newToken);
  localStorage.setItem("user", JSON.stringify(userData));

  setToken(newToken);
  setCurrentUser(userData);
};
  
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setToken(null);
  setCurrentUser(null); 
  };


  return (


    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={!token ?( <Register onLoginSuccess={handleLoginSuccess} /> ):
      (  <Navigate to={
         role === "student"
            ? "/student/dashboard"
            : role === "instructor"
              ? "/instructor/dashboard"
              : "/admin/dashboard"
        }
          replace />)} />


      <Route path="/login" element={!token ? (<LogIn onLoginSuccess={handleLoginSuccess} /> ):
        (<Navigate
          to={
           role === "student"
              ? "/student/dashboard"
              : role === "instructor"
                ? "/instructor/dashboard"
                : "/admin/dashboard"
          }
          replace
        />)} />
      <Route path="/403" element={<Forbidden />} />

      <Route
  element={
    <ProtectedLayout  allowedRoles={["student"]} onLogout={handleLogout}/>}>
        <Route path="/student/dashboard" element={<Dashboard />} />
        <Route path="/student/courses" element={<CourseCatalog />} />
        <Route path="/student/player" element={<CoursePlayer />} />
        {/* <Route path="/student/details" element={<CourseDetails />} /> */}
        <Route path="/student/details/:courseId" element={<CourseDetails />} />
        <Route path="/student/quiz" element={<Quiz />} />
        <Route path="/student/results" element={<QuizResult />} />
        {/* <Route path="/student/assignments" element={<Assigmnent />} /> */}
        <Route path="/student/grades" element={<Grandes />} />
        {/* <Route path="/student/forum" element={<Forum />} /> */}
        <Route path="/student/certificate" element={<Certificate />} />
      </Route>

      <Route element={<ProtectedLayout allowedRoles={["instructor"]}  onLogout={handleLogout} />}>
        <Route path="/instructor/dashboard" element={<DashboardIns />} />
        <Route path="/instructor/create" element={<CreateCourse />} />
        <Route path="/instructor/curriculum" element={<Curriculum />} />
        <Route path="/instructor/edit" element={<EditCourse />} />
        <Route path="/instructor/students" element={<StudentList />} />
        {/* <Route path="/instructor/analytics" element={<CourseAnalytics />} /> */}
        {/* <Route path="/instructor/forum" element={<ForumIns />} /> */}
      </Route>

      <Route element={<ProtectedLayout allowedRoles={["admin"]} onLogout={handleLogout} />}>
        <Route path="/admin/dashboard" element={<DashboardAdm />} />
        <Route path="/admin/users" element={<Usermanagement />} />
        <Route path="/admin/approvals" element={<InstructorApprovals />} />
        {/* <Route path="/admin/courses" element={<CourseManagement />} /> */}
        <Route path="/admin/categories" element={<Categories_Tags />} />
        {/* <Route path="/admin/reports" element={<Reports />} /> */}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;