import React, {useEffect, useState, useMemo } from "react";
import "./admin.css";
import axios from "axios";
import BASE_URL from "../../config/url";

const INIT_USERS = [
  { id: 1,  firstName: "Youssef", lastName: "Zienhoum", email: "youssef@mail.com", role: "STUDENT",    active: true,  createdAt: "2024-09-01", lastActive: "2025-04-20" },
  { id: 2,  firstName: "Sara",    lastName: "Ahmed",    email: "sara@lms.com",     role: "INSTRUCTOR", active: true,  createdAt: "2023-06-01", lastActive: "2025-04-21" },
  { id: 3,  firstName: "Nour",    lastName: "Hassan",   email: "nour@mail.com",    role: "STUDENT",    active: true,  createdAt: "2025-01-10", lastActive: "2025-04-19" },
  { id: 4,  firstName: "Omar",    lastName: "Fathy",    email: "omar@mail.com",    role: "STUDENT",    active: false, createdAt: "2024-11-20", lastActive: "2025-03-01" },
  { id: 5,  firstName: "Karim",   lastName: "Hassan",   email: "karim@lms.com",    role: "INSTRUCTOR", active: true,  createdAt: "2023-09-15", lastActive: "2025-04-20" },
  { id: 6,  firstName: "Lina",    lastName: "Mostafa",  email: "lina@mail.com",    role: "STUDENT",    active: true,  createdAt: "2025-03-12", lastActive: "2025-04-18" },
  { id: 7,  firstName: "Ahmed",   lastName: "Tarek",    email: "ahmed@mail.com",   role: "STUDENT",    active: true,  createdAt: "2025-02-05", lastActive: "2025-04-15" },
  { id: 8,  firstName: "Mona",    lastName: "Ibrahim",  email: "mona@mail.com",    role: "STUDENT",    active: false, createdAt: "2024-10-01", lastActive: "2025-02-10" },
  { id: 9,  firstName: "Admin",   lastName: "User",     email: "admin@lms.com",    role: "ADMIN",      active: true,  createdAt: "2023-01-01", lastActive: "2025-04-21" },
];

const ROLES   = ["All", "STUDENT", "INSTRUCTOR", "ADMIN"];
const STATUSES = ["All", "Active", "Blocked"];
const ROLE_STYLE = {
  STUDENT:    { color: "#1d4ed8", bg: "#dbeafe" },
  INSTRUCTOR: { color: "#7c3aed", bg: "#ede9fe" },
  ADMIN:      { color: "#991b1b", bg: "#fee2e2" },
};

function getInitials(u) {
  return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function UserDrawer({ user, onClose, onUpdate, onDelete }) {
  const [roleEdit,   setRoleEdit]   = useState(user.role);
  const [saving,     setSaving]     = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const rs = ROLE_STYLE[user.role] || ROLE_STYLE.STUDENT;

  const handleSaveRole = async () => {
    if (roleEdit === user.role) return;
    setSaving(true);
    /* PATCH /admin/users/:id { role: roleEdit } */
    await new Promise((r) => setTimeout(r, 500));
    onUpdate(user.id, { role: roleEdit });
    setSaving(false);
  };

  return (
    <div className="ip-drawer-overlay" onClick={onClose}>
      <div className="ip-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ip-drawer__header">
          <div className="ip-drawer__avatar" style={{ background: rs.bg, color: rs.color, border: `2px solid ${rs.color}` }}>
            {getInitials(user)}
          </div>
          <div>
            <h2 className="ip-drawer__name">{user.firstName} {user.lastName}</h2>
            <p className="ip-drawer__email">{user.email}</p>
          </div>
          <button className="ip-drawer__close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="ip-drawer__body">
          {[
            { label: "User ID",     val: `#${user.id}` },
            { label: "Status",      val: <span className={`ad-status-dot ${user.active ? "ad-status-dot--active" : "ad-status-dot--blocked"}`}>{user.active ? "Active" : "Blocked"}</span> },
            { label: "Joined",      val: formatDate(user.createdAt) },
            { label: "Last Active", val: formatDate(user.lastActive) },
          ].map((r) => (
            <div key={r.label} className="ip-drawer__row">
              <span className="ip-drawer__label">{r.label}</span>
              <span className="ip-drawer__val">{r.val}</span>
            </div>
          ))}

          {/* Role change */}
          <div className="ap-field" style={{ marginTop: 4 }}>
            <label className="ap-label">Change Role</label>
            <div className="ap-role-pills">
              {["STUDENT", "INSTRUCTOR", "ADMIN"].map((r) => {
                const s = ROLE_STYLE[r];
                return (
                  <button key={r}
                    className={`ap-role-pill ${roleEdit === r ? "ap-role-pill--active" : ""}`}
                    style={roleEdit === r ? { background: s.bg, color: s.color, borderColor: s.color } : {}}
                    onClick={() => setRoleEdit(r)}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
            {roleEdit !== user.role && (
              <button className="ad-btn-primary" style={{ marginTop: 8, fontSize: 12 }} onClick={handleSaveRole} disabled={saving}>
                {saving ? "Saving…" : `Save: Change to ${roleEdit}`}
              </button>
            )}
          </div>

          {/* Block / Unblock */}
          <button
            className={`ap-block-btn ${user.active ? "ap-block-btn--block" : "ap-block-btn--unblock"}`}
            onClick={() => onUpdate(user.id, { active: !user.active })}
          >
            {user.active ? "Block User" : "Unblock User"}
          </button>
        </div>

        {/* Footer */}
        <div className="ip-drawer__footer">
          {!confirmDel ? (
            <button className="ap-btn-delete" onClick={() => setConfirmDel(true)}>🗑 Delete Account</button>
          ) : (
            <div className="ap-inline-confirm">
              <span style={{ fontSize: 12 }}>Permanently delete?</span>
              <button className="ap-btn-delete" onClick={() => { onDelete(user.id); onClose(); }}>Yes</button>
              <button className="ad-btn-ghost" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => setConfirmDel(false)}>No</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default function Usermanagement() {
  const token = localStorage.getItem("token")
  const [users,        setUsers]        = useState([]);
  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy,       setSortBy]       = useState("createdAt");
  const [selected,     setSelected]     = useState(null);
  const [toast,        setToast]        = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

const updateUser = async (id, patch) => {
  try {
    if (patch.hasOwnProperty("active")) {
      const endpoint = patch.active
        ? `${BASE_URL}api/admin/users/unblock/${id}`
        : `${BASE_URL}api/admin/users/block/${id}`;

      await axios.put(endpoint, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    if (patch.hasOwnProperty("role")) {
      await axios.put(
        `${BASE_URL}api/admin/users/role/${id}`,
        { role: patch.role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...patch } : u))
    );

    showToast("User updated.");
  } catch (err) {
    console.log(err);
  }
};

const deleteUser = async (id) => {
  try {
    await axios.delete(
      ` ${BASE_URL}api/admin/users/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUsers((prev) => prev.filter((u) => u.id !== id));

    showToast("User deleted.");
  } catch (err) {
    console.log(err);
  }
};

  /* Bulk actions */
  const [selected2, setSelected2] = useState(new Set());

  const toggleSelect = (id) => setSelected2((prev) => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  const bulkBlock = () => {
    setUsers((prev) => prev.map((u) => selected2.has(u.id) ? { ...u, active: false } : u));
    setSelected2(new Set());
    showToast(`${selected2.size} user(s) blocked.`);
  };



useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}api/admin/users`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formatted = res.data.map((u) => ({
        id: u.id,
        firstName: u.firstname,
        lastName: u.lastname,
        email: u.email,
        role: u.role,
        active: u.active,
          createdAt: u.createdAt || new Date().toISOString(),
  lastActive: u.lastActive || new Date().toISOString(),
      }));

      setUsers(formatted);

    } catch (err) {
      console.log("Error fetching users:", err);
    }
  };

  console.log(token)

  fetchUsers();
}, []);



  const filtered = useMemo(() => {
    return users
      .filter((u) => {
        if (search && !`${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())) return false;
        if (roleFilter   !== "All"     && u.role !== roleFilter)                  return false;
        if (statusFilter === "Active"  && !u.active)                              return false;
        if (statusFilter === "Blocked" && u.active)                               return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name")       return a.firstName.localeCompare(b.firstName);
        if (sortBy === "role")       return a.role.localeCompare(b.role);
        if (sortBy === "createdAt")  return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "lastActive") return new Date(b.lastActive) - new Date(a.lastActive);
        return 0;
      });
  }, [users, search, roleFilter, statusFilter, sortBy]);

  const stats = {
    total:       users.length,
    students:    users.filter((u) => u.role === "STUDENT").length,
    instructors: users.filter((u) => u.role === "INSTRUCTOR").length,
    blocked:     users.filter((u) => !u.active).length,
    admins:      users.filter((u) => u.role === "ADMIN").length,
  };

  return (
    <div className="ap-page">
      <div className="pg-header">
        <div>
          <h1 className="pg-header__title">User Management</h1>
          <p className="pg-header__sub">
            {stats.total} users · {stats.students} students · {stats.instructors} instructors · {stats.blocked} blocked
          </p>
        </div>
        <button className="ad-btn-ghost" onClick={() => {
          const csv = ["Name,Email,Role,Status,Joined"].concat(
            users.map((u) => `${u.firstName} ${u.lastName},${u.email},${u.role},${u.active ? "Active" : "Blocked"},${u.createdAt}`)
          ).join("\n");
          const a = document.createElement("a");
          a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
          a.download = "users.csv"; a.click();
        }}>
          ⬇ Export CSV
        </button>
      </div>

      {toast && <div className="ap-toast">{toast}</div>}

      <div className="ip-stats-strip">
        {[
          { label: "Total",       val: stats.total,       color: "var(--text-primary)" },
          { label: "Students",    val: stats.students,    color: "#1d4ed8" },
          { label: "Instructors", val: stats.instructors, color: "#7c3aed" },
          { label: "Admins",      val: stats.admins,      color: "#991b1b" },
          { label: "Blocked",     val: stats.blocked,     color: "#6b6b6b" },
        ].map((s) => (
          <div key={s.label} className="ip-stat-box">
            <span className="ip-stat-box__val" style={{ color: s.color }}>{s.val}</span>
            <span className="ip-stat-box__label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="ip-controls">
        <div className="ip-search-wrap">
          <input className="ip-search" placeholder="Search by name or email…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button className="ip-search-clear" onClick={() => setSearch("")}>✕</button>}
        </div>
        <select className="ip-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          {ROLES.map((r) => <option key={r} value={r}>{r === "All" ? "All Roles" : r}</option>)}
        </select>
        <select className="ip-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {STATUSES.map((s) => <option key={s}>{s === "All" ? "All Statuses" : s}</option>)}
        </select>
        <select className="ip-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Newest first</option>
          <option value="lastActive">Last active</option>
          <option value="name">Name A–Z</option>
          <option value="role">Role</option>
        </select>
        {selected2.size > 0 && (
          <button className="ap-btn-delete" style={{ padding: "8px 16px", fontSize: 12 }} onClick={bulkBlock}>
             Block {selected2.size} selected
          </button>
        )}
      </div>

      <div className="ip-table-wrap">
        {filtered.length === 0 ? (
          <div className="pg-empty"><span>👥</span><p>No users match your filters.</p></div>
        ) : (
          <table className="ip-table">
            <thead>
              <tr>
                <th style={{ width: 36 }}>
                  <input type="checkbox"
                    onChange={(e) => setSelected2(e.target.checked ? new Set(filtered.map((u) => u.id)) : new Set())}
                    checked={selected2.size === filtered.length && filtered.length > 0}
                  />
                </th>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const rs = ROLE_STYLE[u.role] || ROLE_STYLE.STUDENT;
                return (
                  <tr key={u.id} className="ip-table__row" onClick={() => setSelected(u)}>
                    <td onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox"
                        checked={selected2.has(u.id)}
                        onChange={() => toggleSelect(u.id)}
                      />
                    </td>
                    <td>
                      <div className="ad-user-cell">
                        <div className="ad-user-avatar" style={{ background: rs.bg, color: rs.color }}>
                          {getInitials(u)}
                        </div>
                        <div>
                          <p className="ad-user-name">{u.firstName} {u.lastName}</p>
                          <p className="ad-user-email">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="ad-role-badge" style={{ background: rs.bg, color: rs.color }}>{u.role}</span>
                    </td>
                    <td>
                      <span className={`ad-status-dot ${u.active ? "ad-status-dot--active" : "ad-status-dot--blocked"}`}>
                        {u.active ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="ad-date-cell">{formatDate(u.createdAt)}</td>
                    <td className="ad-date-cell">{formatDate(u.lastActive)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="ad-row-actions">
                        <button className="ad-action-btn"
                          onClick={() => updateUser(u.id, { active: !u.active })}>
                          {u.active ? "Block" : "Unblock"}
                        </button>
                        <button className="ad-action-btn ad-action-btn--danger"
                          onClick={() => deleteUser(u.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <UserDrawer
          user={selected}
          onClose={() => setSelected(null)}
          onUpdate={updateUser}
          onDelete={deleteUser}
        />
      )}
    </div>
  );
}