export class Api {
    constructor(options) {
      this._headers = options.headers;
      this._url = options.url;
    }
  
    _checkResponse(res) {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  
    getUserInfo() {
      console.log(this._url);
      return fetch(`${this._url}/users/me`, {
        method: "GET",
        headers: this._headers,
      }).then(this._checkResponse);
    }
  
    getInitialCards() {
      return fetch(`${this._url}/cards`, {
        headers: this._headers,
      }).then((res) => {
        return this._checkResponse(res);
      });
    }
  
    changeLikeCardStatus(cardId, isNotLiked) {
      return fetch(`${this._url}/cards/${cardId}/likes`, {
        method: isNotLiked ? "PUT" : "DELETE",
        headers: this._headers,
      }).then((res) => {
        return this._checkResponse(res);
      });
    }
  
    setUserData(name, about) {
      return fetch(`${this._url}/users/me`, {
        method: "PATCH",
        headers: this._headers,
        body: JSON.stringify({
          name: name,
          about: about,
        }),
      }).then((res) => {
        return this._checkResponse(res);
      });
    }
  
    addNewCard({ name, link }) {
      return fetch(`${this._url}/cards`, {
        method: "POST",
        headers: this._headers,
        body: JSON.stringify({
          name: name,
          link: link,
        }),
      }).then((res) => {
        return this._checkResponse(res);
      });
    }
  
    deleteCard(cardId) {
      return fetch(`${this._url}/cards/${cardId}`, {
        method: "DELETE",
        headers: this._headers,
      }).then((res) => {
        return this._checkResponse(res);
      });
    }
  
    setUserAvatar(link) {
      return fetch(`${this._url}/users/me/avatar`, {
        method: "PATCH",
        headers: this._headers,
        body: JSON.stringify({
          avatar: link,
        }),
      }).then((res) => {
        return this._checkResponse(res);
      });
    }
  }
  
  export default new Api({
    url: "https://api.heyrene.nomoredomains.monster",
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
      "Content-Type": "application/json",
    },
  });
