import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValue.email || !formValue.password) {
      return;
    }
    const { email, password } = formValue;
    onLogin(email, password);
  };

  return (
    <div className="auth">
      <p className="auth__title">Вxод</p>
      <form onSubmit={handleSubmit} className="auth__form">
        <input
          className="auth__input"
          placeholder="Email"
          id="email"
          name="email"
          type="text"
          value={formValue.email}
          onChange={handleChange}
          minLength="2"
          maxLength="40"
          required
        />
        <input
          className="auth__input"
          placeholder="Пароль"
          id="password"
          name="password"
          type="password"
          value={formValue.password}
          onChange={handleChange}
          minLength="4"
          maxLength="40"
          required
        />
        <button type="submit" className="auth__submit-button">
          Войти
        </button>
      </form>
    </div>
  );
};
export default Login;
