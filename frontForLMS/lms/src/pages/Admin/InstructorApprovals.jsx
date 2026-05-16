import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import "./pages.css";
import BASE_URL from "../../config/url";
export default function InstructorApprovals() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post(
        `${BASE_URL}api/admin/users/CreateUser`,
        {
          email: data.email,
          password: data.password,
          firstname: data.firstName,
          lastname: data.lastName,
          role: "INSTRUCTOR", 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Instructor account created successfully ");
      reset();
      navigate("/admin/users");
    } catch (e) {
      console.error(e);
      alert(
        e.response?.data?.message ||
          "Failed to create instructor. Please try again."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-wrap">
        <div className="auth-brand">
          <span className="auth-brand__logo">🎓</span>
          <span className="auth-brand__name">LMS Platform</span>
        </div>

        <h2>Create Instructor Account</h2>
        <p>Only admins can create instructor accounts.</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth-row">
            <div className="auth-field">
              <input
                placeholder="First Name"
                className={errors.firstName ? "auth-input-error" : ""}
                {...register("firstName", {
                  required: "First name is required",
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
                  required: "Last name is required",
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
                  value: /\S+@\S+\.\S+/,
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
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d)/,
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
            {errors.confirmPassword && (
              <p>{errors.confirmPassword.message}</p>
            )}
          </div>

          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            {isSubmitting ? "Creating instructor…" : "Create Instructor"}
          </button>

          <p className="auth-switch-link">
            <button
              type="button"
              className="auth-back-link"
              onClick={() => navigate("/admin/dashboard")}
            >
              ← Back to Dashboard
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}