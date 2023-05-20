import { useState } from "react";
import { Link } from "react-router-dom";

function Register({ onRegister }) {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    const { email, password } = formValue;
    e.preventDefault();
    onRegister(email, password);
  }

  return (
    <div className="auth">
      <p className="auth__title">Регистрация</p>
      <form onSubmit={handleSubmit} className="auth__form">
        <input
          className="auth__input"
          placeholder="Email"
          id="email"
          name="email"
          type="email"
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
          Зарегистрироваться
        </button>
        <Link to="/sign-in" className="auth__link">
          Уже зарегистрированы? Войти
        </Link>
      </form>
    </div>
  );
}
export default Register;
