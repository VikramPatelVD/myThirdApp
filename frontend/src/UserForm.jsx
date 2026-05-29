import React, { useState, useEffect } from "react";

function UserForm({ editingUser, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingUser) {
      setForm({
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        city: editingUser.city,
      });
    } else {
      setForm({ name: "", email: "", phone: "", city: "" });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic Validation
    const errs = {};
    if (!form.name.trim()) errs.name = "Name required";
    if (!form.email.trim()) errs.email = "Email required";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // FIX: Merge the editingUser's ID (and any other hidden fields) with the updated form data
    if (editingUser) {
      onSave({ ...editingUser, ...form });
    } else {
      onSave(form);
    }

    // CLEAR DATA AFTER SUBMITTING
    setForm({ name: "", email: "", phone: "", city: "" });
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ background: "#f9f9f9", padding: "20px", borderRadius: "8px" }}
    >
      <h2>{editingUser ? "Edit User" : "Register New User"}</h2>

      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        style={inputStyle}
      />
      {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        style={inputStyle}
      />
      {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}

      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        style={inputStyle}
      />
      <input
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
        style={inputStyle}
      />

      <button
        type="submit"
        style={{
          padding: "10px 20px",
          background: "#1F4E79",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {editingUser ? "Update User" : "Register"}
      </button>

      {editingUser && (
        <button
          type="button"
          onClick={onCancel}
          style={{ marginLeft: "10px", padding: "10px 20px" }}
        >
          Cancel
        </button>
      )}
    </form>
  );
}

export default UserForm;
