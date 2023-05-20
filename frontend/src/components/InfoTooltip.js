import resolve from "../images/resolve.svg";
import reject from "../images/reject.svg";
function InfoTooltip(props) {
  return (
    <section
      className={`popup popup_func_info ${
        props.isOpen ? "popup_opened" : false
      }`}
      onClick={props.onOverlayClose}
    >
      <div className={`popup__container popup__container_func_info`}>
        <img
          className="popup__image-info"
          src={props.result ? resolve : reject}
          alt="Значок результата"
        ></img>
        <h3 className="popup__title popup__title_func_info">
          {props.result
            ? "Вы успешно зарегестрировались!"
            : "Что-то пошло не так! Попробуйте еще раз."}
        </h3>
        <button
          className="popup__close-button"
          type="button"
          aria-label="закрыть"
          onClick={props.onClose}
        ></button>
      </div>
    </section>
  );
}
export default InfoTooltip;
