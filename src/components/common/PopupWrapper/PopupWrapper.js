import React, {useEffect} from "react";
import cx from 'classnames'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { ReactComponent as CloseIcon } from '../../../assets/svg/close-icon-disabled.svg'
import './PopupWrapper.sass'

function PopupWrapper({ className, opened, title, children, onClose }) {
    const popupRef = React.createRef();

    useEffect(function toggleBodyScroll() {
        if (opened)
            disableBodyScroll(popupRef.current);
        else
            enableBodyScroll(popupRef.current);

        return () => {
            clearAllBodyScrollLocks()
        }
    }, [opened, popupRef]);

    return (
        <div className={ cx('popup-container', { 'popup-container--opened': opened })}>
            <div className={ cx(className, 'popup-wrapper') }
                 ref={ popupRef }>
                <div className="popup__header">
                    <h4 className="popup__header__title">{ title }</h4>
                    <button onClick={ onClose } className="popup__btn-close">
                        <CloseIcon />
                    </button>
                </div>
                <div className="popup_content">
                    { children }
                </div>
            </div>
            {
                opened &&
                <div className="popup__close-layer" onClick={ onClose } />
            }
        </div>
    )
}

export default PopupWrapper