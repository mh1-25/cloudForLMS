
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdMenuBook,
  MdMenu,
  MdPeople,
  MdBarChart,
  MdForum,
  MdSettings,
  MdVerifiedUser,
  MdCategory,
  MdAssessment,
  MdClass,
  MdEditNote,
  MdSchool,
  MdGrade,
  MdWorkspacePremium,
  MdChecklist,
  MdApproval,
  MdManageAccounts,
} from "react-icons/md";
import {
  FaChevronRight,
  FaChevronDown,
  FaUserGraduate,
  FaPlayCircle,
  FaClipboardList,
  FaCertificate,
  FaPlusCircle,
  FaListAlt,
} from "react-icons/fa";



/* ── Nav config with icons ── */
const navByRole = {
  student: [
    {
      label: "Dashboard",
      icon: <MdDashboard />,
      path: "/student/dashboard",
    },
    {
      label: "Courses",
      icon: <MdMenuBook />,
      path: "/student/courses",
    },
    // {
    //   label: "Course Player",
    //   icon: <FaPlayCircle />,
    //   path: "/student/player",
    // },
    // {
    //   label: "Quiz",
    //   icon: <FaClipboardList />,
    //   path: "/student/quiz",
    // },
    // {
    //   label: "Results",
    //   icon: <MdGrade />,
    //   path: "/student/results",
    // },
    // {
    //   label: "Assignments",
    //   icon: <MdChecklist />,
    //   path: "/student/assignments",
    // },
    {
      label: "Grades",
      icon: <MdAssessment />,
      path: "/student/grades",
    },
    // {
    //   label: "Forum",
    //   icon: <MdForum />,
    //   path: "/student/forum",
    // },
    {
      label: "Certificate",
      icon: <FaCertificate />,
      path: "/student/certificate",
    },
    // {
    //   label: "Settings",
    //   icon: <MdSettings />,
    //   path: "/student/settings",
    // },
  ],

  instructor: [
    {
      label: "Dashboard",
      icon: <MdDashboard />,
      path: "/instructor/dashboard",
    },
    {
      label: "Create Course",
      icon: <FaPlusCircle />,
      path: "/instructor/create",
    },
    {
      label: "Curriculum",
      icon: <FaListAlt />,
      path: "/instructor/curriculum",
    },
    {
      label: "Edit Course",
      icon: <MdEditNote />,
      path: "/instructor/edit",
    },
    {
      label: "Students",
      icon: <FaUserGraduate />,
      path: "/instructor/students",
    },
    // {
    //   label: "Analytics",
    //   icon: <MdBarChart />,
    //   path: "/instructor/analytics",
    // },
    // {
    //   label: "Forum",
    //   icon: <MdForum />,
    //   path: "/instructor/forum",
    // },
  ],

  admin: [
    {
      label: "Dashboard",
      icon: <MdDashboard />,
      path: "/admin/dashboard",
    },
    {
      label: "Users",
      icon: <MdManageAccounts />,
      path: "/admin/users",
    },
    {
      label: "Approvals",
      icon: <MdApproval />,
      path: "/admin/approvals",
    },
    // {
    //   label: "Courses",
    //   icon: <MdClass />,
    //   path: "/admin/courses",
    // },
    {
      label: "Categories",
      icon: <MdCategory />,
      path: "/admin/categories",
    },
    // {
    //   label: "Reports",
    //   icon: <MdAssessment />,
    //   path: "/admin/reports",
    // },
  ],
};

/* ── Role badge colors ── */
const roleMeta = {
  student: { label: "Student", color: "#3b82f6" },
  instructor: { label: "Instructor", color: "#f59e0b" },
  admin: { label: "Admin", color: "#ff6b35" },
};

export default function VerticalNav({ onLogout }) {

const token = localStorage.getItem("token")

    const currentUser = JSON.parse(localStorage.getItem("user"));
  const role = currentUser?.role?.toLowerCase() || "student";

  // const navItems = navByRole[role] || navByRole.student;
  const navItems = navByRole[role] || navByRole.student;
  const navigate = useNavigate();
  const location = useLocation();
  

  const [openMenu, setOpenMenu] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const handleItemClick = (item) => {
    if (item.children) {
      setOpenMenu(openMenu === item.label ? null : item.label);
    } else {
      navigate(item.path);
    }
  };

  const isActive = (path) => location.pathname === path;
  const meta = roleMeta[role] || roleMeta.student;

  return (
    <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
      {/* ── Header ── */}
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">
              Akkor<sup>™</sup>
            </span>
          </div>
        )}
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          <MdMenu />
        </button>
      </div>

      {/* ── User badge ── */}
      {!collapsed && currentUser && (
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {currentUser.firstname?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">
              {currentUser.firstname} {currentUser.lastname}
            </span>
            <span
              className="sidebar-user-role"
              style={{ color: meta.color }}
            >
              {meta.label}
            </span>
          </div>
        </div>
      )}

      {/* ── Nav items ── */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isOpen = openMenu === item.label;
          const hasChildren = !!item.children;
          const active = isActive(item.path);

          return (
            <div key={item.label} className="nav-group">
              <button
                className={`nav-item${active ? " active" : ""}`}
                onClick={() => handleItemClick(item)}
                title={collapsed ? item.label : undefined}
              >
                <span className="nav-icon">{item.icon}</span>

                {!collapsed && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    {hasChildren && (
                      <span className="nav-arrow">
                        {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                      </span>
                    )}
                  </>
                )}

                {/* tooltip when collapsed */}
                {collapsed && (
                  <span className="nav-tooltip">{item.label}</span>
                )}
              </button>

              {/* Children */}
              {hasChildren && isOpen && !collapsed && (
                <div className="nav-children">
                  {item.children.map((child) => (
                    <button
                      key={child.label}
                      className={`nav-child${isActive(child.path) ? " active" : ""}`}
                      onClick={() => navigate(child.path)}
                    >
                      <span className="child-bullet">›</span>
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Logout ── */}
      {!collapsed && (
        <button
          className="sidebar-logout"
          onClick={() => {
            onLogout();
            navigate("/login", { replace: true });
          }}
        >
          Sign out
        </button>
      )}
    </aside>
  );
}
