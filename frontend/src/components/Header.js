import logo from "../images/logo-white.svg";
import { Route, Link, Routes } from "react-router-dom";

function Header(props) {
  return (
    <header className="header">
      <img src={logo} className="header__logo" alt="Логотип проекта Mesto" />
      <nav className="header__menu">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <p className="header__text">{props.email}</p>
                <Link
                  to=""
                  className="header__link"
                  type="button"
                  onClick={props.onSignOut}
                >
                  Выйти
                </Link>
              </>
            }
          />
          <Route
            path="/sign-up"
            element={
              <>
                <Link
                  to="/sign-in"
                  className="header__link"
                  type="button"
                  onClick={props.onClick}
                >
                  Войти
                </Link>
              </>
            }
          />
          <Route
            path="/sign-in"
            element={
              <>
                <Link
                  to="/sign-up"
                  className="header__link"
                  type="button"
                  onClick={props.onClick}
                >
                  Регистрация
                </Link>
              </>
            }
          />
        </Routes>
      </nav>
    </header>
  );
}
export default Header;
