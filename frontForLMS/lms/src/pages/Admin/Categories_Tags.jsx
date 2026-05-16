import React, { useEffect, useState } from "react";
import "./admin.css";
import axios from "axios";
import BASE_URL from "../../config/url";
/* ───────────────── CATEGORY MODAL ───────────────── */
function CategoryModal({ onClose, handleAddNewCategory, initialData, handleUpdateCategory }) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    icon: initialData?.icon || "",
  });

  const [error, setError] = useState("");
  const isEdit = !!initialData;

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Category name is required");
      return;
    }

    if (isEdit) {
      await handleUpdateCategory(initialData.id, form);
    } else {
      await handleAddNewCategory(form);
    }

    onClose();
  };

  return (
    <div className="ap-overlay" onClick={onClose}>
      <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="ap-modal__header">
          <h2 className="ap-modal__title">
            {isEdit ? "Edit Category" : "Add Category"}
          </h2>
          <button className="ap-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="ap-modal__body">

          <div className="ap-field">
            <label className="ap-label">
              Category Name <span className="ap-req">*</span>
            </label>

            <input
              className={`ap-input ${error ? "ap-input--error" : ""}`}
              value={form.name}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }));
                setError("");
              }}
              placeholder="e.g. Web Development"
            />

            {error && <p className="ap-error">{error}</p>}
          </div>

          <div className="ap-field">
            <label className="ap-label">Description</label>

            <textarea
              className="ap-textarea"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Short description of this category…"
            />
          </div>

        </div>

        <div className="ap-modal__footer">
          <button className="ad-btn-ghost" onClick={onClose}>
            Cancel
          </button>

          <button className="ad-btn-primary" onClick={handleSave}>
            {isEdit ? "Update Category" : "Add Category"}
          </button>
        </div>

      </div>
    </div>
  );
}

/* ───────────────── DELETE MODAL ───────────────── */
function DeleteConfirm({ item, type, onClose, onConfirm }) {
  return (
    <div className="ap-overlay" onClick={onClose}>
      <div className="ap-modal ap-modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="ap-modal__header">
          <h2 className="ap-modal__title">Delete {type}</h2>
          <button className="ap-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="ap-modal__body">
          <p className="ap-confirm-text">
            Are you sure you want to delete <strong>"{item.name}"</strong>?
            {item.courseCount > 0 && (
              <span className="ap-confirm-warn">
                {" "}This {type.toLowerCase()} is used by {item.courseCount} course{item.courseCount !== 1 ? "s" : ""}.
                Those courses will lose this {type.toLowerCase()}.
              </span>
            )}
          </p>
        </div>
        <div className="ap-modal__footer">
          <button className="ad-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ap-btn-delete" onClick={() => { onConfirm(item.id); onClose(); }}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── MAIN ───────────────── */
export default function Categories_Tags() {

  const token = localStorage.getItem("token");
  const [allCategory, setAllCategory] = useState([]);

  const [catSearch, setCatSearch] = useState("");
  const [catModal, setCatModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  /* ADD */
  const handleAddNewCategory = async (form) => {
    try {
      const res = await axios.post(
        `${BASE_URL}api/categories/create`,
        {
          name: form.name,
          description: form.description,
          icon: form.icon,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllCategory((prev) => [...prev, res.data]);

    } catch (err) {
      console.log(err);
    }
  };

  /* UPDATE */
  const handleUpdateCategory = async (id, form) => {
    try {
      const res = await axios.put(
        `${BASE_URL}api/categories/update/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllCategory((prev) =>
        prev.map((cat) => (cat.id === id ? res.data : cat))
      );

      showToast("Category updated successfully");

    } catch (err) {
      console.log(err);
      showToast("Update failed");
    }
  };

  /* DELETE */
  const deleteCategory = async (id) => {
    try {
      await axios.delete(
        `${BASE_URL}api/categories/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllCategory((prev) => prev.filter((c) => c.id !== id));

      showToast("Category deleted successfully");

    } catch (err) {
      console.log(err);
      showToast("Failed to delete category");
    }
  };

  /* FETCH */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}api/categories/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAllCategory(res.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="ap-page">
      <div className="pg-header">
        <div>
          <h1 className="pg-header__title">Categories </h1>
          <p className="pg-header__sub">
            {allCategory.length} categories
          </p>
        </div>
      </div>

      <div className="ap-two-col">

        <div className="ap-panel">
          <div className="ap-panel__header">
            <div>
              <h2 className="ap-panel__title">Categories</h2>
              <p className="ap-panel__sub">{allCategory.length} total</p>
            </div>
            <button className="ad-btn-primary" onClick={() => setCatModal("new")}>
              + Add Category
            </button>
          </div>

          <div className="ap-panel__search">
            <div className="ip-search-wrap">
              <input className="ip-search"
                placeholder="Search categories…"
                value={catSearch}
                onChange={(e) => setCatSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="ap-cat-list">
            {allCategory.map((cat) => (
              <div key={cat.id} className="ap-cat-card">
                <div className="ap-cat-card__icon">🗂</div>

                <div className="ap-cat-card__info">
                  <h3 className="ap-cat-card__name">{cat.name}</h3>
                  {cat.description && (
                    <p className="ap-cat-card__desc">{cat.description}</p>
                  )}
                  <span className="ap-cat-card__count">{cat.courseCount} courses</span>
                </div>

                <div className="ap-cat-card__actions">
                  <button className="ad-action-btn" onClick={() => setCatModal(cat)}>Edit</button>

                  <button
                    className="ad-action-btn ad-action-btn--danger"
                    onClick={() => setDeleteTarget({ item: cat, type: "Category" })}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {catModal && (
        <CategoryModal
          onClose={() => setCatModal(null)}
          handleAddNewCategory={handleAddNewCategory}
          handleUpdateCategory={handleUpdateCategory}
          initialData={typeof catModal === "object" ? catModal : null}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          item={deleteTarget.item}
          type={deleteTarget.type}
          onClose={() => setDeleteTarget(null)}
          onConfirm={deleteCategory}
        />
      )}
    </div>
  );
}