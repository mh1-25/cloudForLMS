import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

import BASE_URL from "../config/url";
const ROLE_OPTIONS = [
  { value: "STUDENT",    label: "Student",    desc: "Browse & enroll in courses" },
  // { value: "INSTRUCTOR", label: "Instructor", desc: "Create & manage courses"    },
  // { value: "ADMIN",      label: "Admin",      desc: "Full platform access"       },
];

function Register({ onLoginSuccess }) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: "STUDENT" } });

  const [role,      setRole]      = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${BASE_URL}api/auth/signup`, {
        email: data.email,
        password:  data.password,
        firstname:data.firstName,
        lastname: data.lastName,
        role: data.role.toUpperCase(),
      });

      const normalizedRole = res.data.role?.toLowerCase().replace("role_", "");

      setRole(normalizedRole);

      onLoginSuccess(res.data.token, {
        id:        res.data.id,
        firstname: res.data.firstname || res.data.firstname || "",
        lastname:  res.data.lastname  || res.data.lastname  || "",
        email:     res.data.email,
        role:      normalizedRole,
        id : res.data.id
      });

      setSubmitted(true);
      reset();
    } catch (e) {
      console.error(e);
      if (e.response) {
        alert(e.response.data.message || "Registration failed. Try again.");
      } else {
        alert("Cannot connect to server. Make sure the backend is running.");
      }
    }
  };

  useEffect(() => {
    if (!submitted || !role) return;
    if (role === "student")    navigate("/student/dashboard",    { replace: true });
    else if (role === "instructor") navigate("/instructor/dashboard", { replace: true });
    else                            navigate("/admin/dashboard",      { replace: true });
  }, [submitted, role, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-form-wrap">

        {/* Brand */}
        <div className="auth-brand">
          <span className="auth-brand__logo">🎓</span>
          <span className="auth-brand__name">LMS Platform</span>
        </div>

        <h2>Create your account</h2>
        <p>Join thousands of learners and educators on the platform.</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* Name row */}
          <div className="auth-row">
            <div className="auth-field">
              <input
                placeholder="First Name"
                className={errors.firstName ? "auth-input-error" : ""}
                {...register("firstName", {
                  required:  "First name is required",
                  minLength: { value: 2, message: "At least 2 characters" },
                })}
              />
              {errors.firstName && <p>{errors.firstName.message}</p>}
            </div>

            <div className="auth-field">
              <input
                placeholder="Last Name"
                className={errors.lastName ? "auth-input-error" : ""}
                {...register("lastName", {
                  required:  "Last name is required",
                  minLength: { value: 2, message: "At least 2 characters" },
                })}
              />
              {errors.lastName && <p>{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="auth-field">
            <input
              type="email"
              placeholder="Email address"
              className={errors.email ? "auth-input-error" : ""}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:   /\S+@\S+\.\S+/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>

          <div className="auth-field">
            <input
              type="password"
              placeholder="Password"
              className={errors.password ? "auth-input-error" : ""}
              {...register("password", {
                required:  "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
                pattern: {
                  value:   /^(?=.*[A-Z])(?=.*\d)/,
                  message: "Must include 1 uppercase letter and 1 number",
                },
              })}
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>

          <div className="auth-field">
            <input
              type="password"
              placeholder="Confirm Password"
              className={errors.confirmPassword ? "auth-input-error" : ""}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (val) =>
                  val === watch("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
          </div>

          <div className="auth-field">
            <label className="auth-label">I want to join as</label>
            <div className="auth-role-grid">
              {ROLE_OPTIONS.map(({ value, label, desc }) => (
                <label
                  key={value}
                  className={`auth-role-card ${selectedRole === value ? "auth-role-card--active" : ""}`}
                >
                  <input
                    type="radio"
                    value={value}
                    {...register("role", { required: true })}
                  />
                  <span className="auth-role-name">{label}</span>
                  <span className="auth-role-desc">{desc}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Create Account"}
          </button>

          <p className="auth-switch-link">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;