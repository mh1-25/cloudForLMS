import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import BASE_URL from "../config/url";

function LogIn({ onLoginSuccess }) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [role, setRole]      = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${BASE_URL}api/auth/login`, {
        email:    data.email,
        password: data.password,
      });

      const normalizedRole = res.data.role?.toLowerCase()

      setRole(normalizedRole);

      onLoginSuccess(res.data.token, {
        id: res.data.id,
        firstname: res.data.firstname  || "",
        lastname: res.data.lastname   || "",
        email:  res.data.email,
        role: normalizedRole,
        id:res.data.id
      });

      setSubmitted(true);
      reset()
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(error.response.data.message || "Login failed. Check your credentials.");
      } else {
        alert("Cannot connect to server. Make sure the backend is running.");
      }
    }
  };

  useEffect(() => {
    if (!submitted || !role) return;
    if      (role === "student")    navigate("/student/dashboard",    { replace: true });
    else if (role === "instructor") navigate("/instructor/dashboard", { replace: true });
    else                            navigate("/admin/dashboard",      { replace: true });
  }, [submitted, role, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-form-wrap">

        <div className="auth-brand">
          <span className="auth-brand__name">LMS Platform</span>
        </div>

        <h2>Welcome back</h2>
        <p>Sign in to continue learning.</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          <div className="auth-field">
            <input
              type="email"
              placeholder="Email address"
              className={errors.email ? "auth-input-error" : ""}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <input
              type="password"
              placeholder="Password"
              className={errors.password ? "auth-input-error" : ""}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>

          {/* Forgot password */}
          <p className="auth-forgot">
            <a href="/forgot-password">Forgot password?</a>
          </p>

          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign In"}
          </button>

          <p className="auth-switch-link">
            Don't have an account? <a href="/register">Create one</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LogIn;