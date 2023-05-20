import React from "react";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import Header from "./Header.js";
import Login from "./Login";
import Register from "./Register";
import Main from "./Main.js";
import Footer from "./Footer.js";
import ImagePopup from "./ImagePopup.js";
import api from "../utils/api";
import { currentUserContext } from "../contexts/CurrentUserContext.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import DeletePlacePopup from "./DeletePlacePopup";
import * as auth from "../utils/auth.js";
import ProtectedRouteElement from "./ProtectedRoute.js";
import InfoTooltip from "./InfoTooltip.js";


function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteCard, setDeleteCard] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isInfoTooltipResult, setInfoTooltipResult] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api
      .getInitialCards()
      .then((data) => {
        setCards(data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api
      .getUserInfo()
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    handleTokenCheck();
  }, []);

  useEffect(() => {
    if (isLoggedIn === true) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  function handleTokenCheck() {
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
      auth
        .checkToken(jwt)
        .then((res) => {
          setIsLoggedIn(true);
          setEmail(res.data.email);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function onLogin(email, password) {
    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          setEmail(email);
          handleLoggedIn();
          localStorage.setItem("jwt", data.token);
          navigate("/", { replace: true });
          console.log(isLoggedIn);
        }
      })
      .catch((err) => {
        console.log(err);
        handleInfoTooltip(false);
      });
  }

  function onRegister(email, password) {
    return auth
      .register({ email, password })
      .then((res) => {
        handleInfoTooltip(true);
        navigate("/sign-in", { replace: true });
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        handleInfoTooltip(false);
      });
  }

  function handleLoggedIn() {
    setIsLoggedIn(true);
  }
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleDeleteCardClick(card) {
    setIsDeletePopupOpen(true);
    setDeleteCard(card);
  }
  function handleInfoTooltip(res) {
    setIsInfoTooltipPopupOpen(true);
    setInfoTooltipResult(res);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeletePopupOpen(false);
    setSelectedCard({});
    setDeleteCard({});
    setIsInfoTooltipPopupOpen(false);
  }

  function handleOverlayClose(evt) {
    if (
      evt.target.classList.contains("popup_opened") ||
      evt.target.classList.contains("popup__close-button")
    ) {
      closeAllPopups();
    }
  }
  useEffect(() => {
    const handleEscClose = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };
    document.addEventListener("keydown", handleEscClose);
    return () => document.removeEventListener("keydown", handleEscClose);
  }, []);

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleSignOut() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setEmail("");
    navigate("sign-in", { replace: true });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleCardDelete(card) {
    setIsLoading(true);
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((cards) =>
          cards.filter((c) => (c._id === card._id ? false : true))
        );
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateUser(formValues) {
    const { name, about } = formValues;
    setIsLoading(true);
    api
      .setUserData(name, about)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar(link) {
    setIsLoading(true);
    api
      .setUserAvatar(link)
      .then((data) => {
        setCurrentUser({ ...currentUser, avatar: data.avatar });
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleAddPlaceSubmit(card) {
    setIsLoading(true);
    api
      .addNewCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <currentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="container">
          <Header
            isLoggedIn={isLoggedIn}
            email={email}
            onSignOut={handleSignOut}
          />
          <Routes>
            <Route
              exact
              path="/"
              element={
                <ProtectedRouteElement
                  component={Main}
                  isLoggedIn={isLoggedIn}
                  onEditProfile={handleEditProfileClick}
                  onEditAvatar={handleEditAvatarClick}
                  onAddPlace={handleAddPlaceClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleDeleteCardClick}
                  cards={cards}
                />
              }
            />
            <Route
              path="/sign-in"
              element={<Login isLoggedIn={isLoggedIn} onLogin={onLogin} />}
            />
            <Route
              path="/sign-up"
              element={
                <Register isLoggedIn={isLoggedIn} onRegister={onRegister} />
              }
            />
            <Route element={<Navigate to={isLoggedIn ? "/" : "/sign-in"} />} />
          </Routes>
          <Footer />
          <InfoTooltip
            isOpen={isInfoTooltipPopupOpen}
            result={isInfoTooltipResult}
            onClose={closeAllPopups}
            onOverlayClose={handleOverlayClose}
          ></InfoTooltip>
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
            onOverlayClose={handleOverlayClose}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            isLoading={isLoading}
            onOverlayClose={handleOverlayClose}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            isLoading={isLoading}
            onOverlayClose={handleOverlayClose}
          />
          <ImagePopup
            onClose={closeAllPopups}
            card={selectedCard}
            onOverlayClose={handleOverlayClose}
          />
          <DeletePlacePopup
            isOpen={isDeletePopupOpen}
            onClose={closeAllPopups}
            onConfirmDelete={handleCardDelete}
            card={deleteCard}
            isLoading={isLoading}
          />
        </div>
      </div>
    </currentUserContext.Provider>
  );
}

export default App;
