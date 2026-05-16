import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./admin.css";
import BASE_URL from "../../config/url";
function AccessDenied({ navigate }) {
  return (
    <div className="ad-denied">
      <div className="ad-denied__card">
        <h2 className="ad-denied__title">Admin Access Only</h2>
        <p className="ad-denied__msg">
          You don't have permission to view this page.
          Only <strong>Admins</strong> can access the admin panel.
        </p>
        <div className="ad-denied__actions">
          <button className="ad-btn-primary" onClick={() => navigate("/student/dashboard")}>
            Go to Dashboard
          </button>
          <button className="ad-btn-ghost" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

function getInitials(first, last) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const ROLE_STYLE = {
  STUDENT: { color: "#1d4ed8", bg: "#dbeafe" },
  INSTRUCTOR: { color: "#7c3aed", bg: "#ede9fe" },
};

/* ───────────────── Main Dashboard ───────────────── */
export default function Dashbourd() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  if (!currentUser || currentUser.role?.toUpperCase() !== "ADMIN") {
    return <AccessDenied navigate={navigate} />;
  }

  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);

  /* ───────── Fetch Students & Instructors ───────── */
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      try {
 const studentsRes = await axios.get(
        `${BASE_URL}api/admin/users/students`,
        { headers }
      );
      const instructorsRes = await axios.get(
        `${BASE_URL}api/admin/users/instructors`,
        { headers }
      );

      setStudents(studentsRes.data);
      setInstructors(instructorsRes.data);
      }catch(e){
console.log("the error is " + e);

      }
     
    };

    fetchData();
  }, [token]);

  /* ───────── KPIs ───────── */
  const totalUsers = students.length + instructors.length;
  const blockedUsers =
    students.filter(u => !u.active).length +
    instructors.filter(u => !u.active).length;

  return (
    <div className="ad-page">
      {/* ── Hero ── */}
      <div className="ad-hero">
        <div className="ad-hero__left">
          <div className="ad-hero__avatar-wrap">
            <div className="ad-hero__avatar">
              {getInitials(currentUser.firstname, currentUser.lastname)}
            </div>
            <span className="ad-hero__status" />
          </div>
          <div>
            <p className="ad-hero__greeting">Admin Panel</p>
            <h1 className="ad-hero__name">
              {currentUser.firstname} {currentUser.lastname}
            </h1>
            <p className="ad-hero__email">{currentUser.email}</p>
          </div>
        </div>

        <div className="ad-hero__kpis">
          <div className="ad-hero-kpi">
            <span className="ad-hero-kpi__val">{totalUsers}</span>
            <span className="ad-hero-kpi__label">Users</span>
          </div>
          <div className="ad-hero-kpi">
            <span className="ad-hero-kpi__val">{students.length}</span>
            <span className="ad-hero-kpi__label">Students</span>
          </div>
          <div className="ad-hero-kpi">
            <span className="ad-hero-kpi__val">{instructors.length}</span>
            <span className="ad-hero-kpi__label">Instructors</span>
          </div>
          <div className="ad-hero-kpi ad-hero-kpi--alert">
            <span className="ad-hero-kpi__val">{blockedUsers}</span>
            <span className="ad-hero-kpi__label">Blocked</span>
          </div>
        </div>
      </div>

      <div className="ad-section">
        <div className="ad-section__header">
          <h2 className="ad-section__title">Students</h2>
          <button className="ad-btn-link" onClick={() => navigate("/admin/users")}>
            Manage All users →
          </button>
        </div>

        <div className="ad-section__body">
          <table className="ad-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.slice(0, 5).map(u => {
                const rs = ROLE_STYLE.STUDENT;
                return (
                  <tr key={u.id} className="ad-table__row">
                    <td>
                      <div className="ad-user-cell">
                        <div className="ad-user-avatar">
                          {getInitials(u.firstName, u.lastName)}
                        </div>
                        <div>
                          <p className="ad-user-name">{u.firstName} {u.lastName}</p>
                          <p className="ad-user-email">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="ad-role-badge" style={{ background: rs.bg, color: rs.color }}>
                        STUDENT
                      </span>
                    </td>
                    <td>
                      <span className={`ad-status-dot ${u.active ? "ad-status-dot--active" : "ad-status-dot--blocked"}`}>
                        {u.active ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td>
                      <button
                        className="ad-action-btn"
                        onClick={() => navigate("/admin/users")}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ad-section">
        <div className="ad-section__header">
          <h2 className="ad-section__title">Instructors</h2>
          <button className="ad-btn-link" onClick={() => navigate("/admin/users")}>
            Manage All users →
          </button>
        </div>

        <div className="ad-section__body">
          <table className="ad-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {instructors.slice(0, 5).map(u => {
                const rs = ROLE_STYLE.INSTRUCTOR;
                return (
                  <tr key={u.id} className="ad-table__row">
                    <td>
                      <div className="ad-user-cell">
                        <div className="ad-user-avatar">
                          {getInitials(u.firstName, u.lastName)}
                        </div>
                        <div>
                          <p className="ad-user-name">{u.firstName} {u.lastName}</p>
                          <p className="ad-user-email">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="ad-role-badge" style={{ background: rs.bg, color: rs.color }}>
                        INSTRUCTOR
                      </span>
                    </td>
                    <td>
                      <span className={`ad-status-dot ${u.active ? "ad-status-dot--active" : "ad-status-dot--blocked"}`}>
                        {u.active ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td>
                      <button
                        className="ad-action-btn"
                        onClick={() => navigate("/admin/users")}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}