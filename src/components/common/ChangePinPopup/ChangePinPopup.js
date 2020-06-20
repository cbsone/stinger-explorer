import React, { Component } from "react";
import cx from 'classnames'
import './ChangePinPopup.sass'
import PopupWrapper from "../PopupWrapper/PopupWrapper";
import PinCodeInput from "../PinCodeInput/PinCodeInput";
import JSSalsa20 from "js-salsa20";
import * as Api from '../../../api/api';
import {notify} from "react-notify-toast";

class ChangePinPopup extends Component {
    state = {
        oldPin: '',
        newPin: '',
        isOldPinValid: null
    };

    handleChange = ({ target: { name, value } }) => {
        this.setState({
            [name]: value
        })
    };

    handleClose = () => {
        const { onClose } = this.props;

        this.setState({
            oldPin: '',
            newPin: '',
            isOldPinValid: null
        })
        onClose()
    };

    handleValidateOldPin = () => {
        const { oldPin } = this.state;

        const accountData = localStorage.getItem('account-data');
        if (accountData) {
            const key = new Uint8Array(Buffer.from(require('crypto').createHash('sha256').update(oldPin).digest('hex'), 'hex'));
            const [rNonce, rAccount] = accountData.split(':');
            const nonce = new Uint8Array(Buffer.from(rNonce, 'base64'));
            const ciphertext = new Uint8Array(Buffer.from(rAccount, 'base64'));
            const _s = new  JSSalsa20(key, nonce);
            const rawJSON = Buffer.from(_s.decrypt(ciphertext)).toString();
            try {
                const acc = JSON.parse(rawJSON);
                Api.get_accounts(acc.pubKey).then(accounts => {
                    // console.log('given accounts');
                    // console.log(accounts);
                    if (accounts.account_names && accounts.account_names.length) {
                        if (accounts.account_names.indexOf(acc.name) >= 0) {
                            this.setState({
                                isOldPinValid: true
                            })
                            return
                        }
                    }

                    this.setState({
                        isOldPinValid: false
                    })
                }).catch(err => notify.show(err.toString(), 'error'));
            } catch (err) {
                this.setState({
                    isOldPinValid: false
                })
            }
        }
    };

    handleConfirm = () => {
        const { oldPin, newPin } = this.state;

        if (Api.pinChange(oldPin, newPin)) {
            notify.show('Pin code changed successfully', 'success');
            this.handleClose();
        }
    };

    render() {
        const { opened, title } = this.props;
        const { oldPin, newPin, isOldPinValid } = this.state;

        return (
            <PopupWrapper
                opened={ opened }
                title={ title }
                className="change-pin-popup"
                onClose={ this.handleClose }>
                <PinCodeInput
                    className="change-pin-popup__old-password"
                    error={ isOldPinValid === false }
                    disabled={ isOldPinValid === true }
                    name="oldPin"
                    value={ oldPin }
                    onChange={ this.handleChange }
                    title="Enter old pin-code for change" />
                {
                    isOldPinValid !== true &&
                    <div className="change-pin-popup__btn-container">
                        <button onClick={ this.handleValidateOldPin } className={ cx('change-pin-popup__btn-next', { 'change-pin-popup__btn-next--disabled': oldPin === '' }) }>
                            Next
                        </button>
                    </div>
                }
                <PinCodeInput
                    className={ cx('change-pin-popup__new-password', { 'change-pin-popup__new-password--opened': isOldPinValid === true }) }
                    secure
                    name="newPin"
                    value={ newPin }
                    onChange={ this.handleChange }
                    title="Enter new pin-code for change" />
                {
                    isOldPinValid === false &&
                    <span className="change-pin-popup__error-text">Wrong pin-code</span>
                }
                {
                    isOldPinValid === true &&
                    <div className="change-pin-popup__btn-container">
                        <button onClick={ this.handleConfirm } className="change-pin-popup__btn-confirm">
                            Confirm
                        </button>
                    </div>
                }
            </PopupWrapper>
        )
    }
}

export default ChangePinPopup