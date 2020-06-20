import React, { Component } from "react";
import './SendPopup.sass'
import PopupWrapper from "../../common/PopupWrapper/PopupWrapper";
import Switcher from "../Switcher/Switcher";
import Input from "../../common/Input/Input";
import {ReactComponent as WalletSendIcon} from "../../../assets/svg/wallet-send-icon.svg";

class SendPopup extends Component {

    state = {
        mode: 'CBS',
        sendTo: '',
        amount: '',
        maxAmount: 10.34,
        memo: '',
        pin: '',
        pinCode: ['', '', '', '' ,'', ''],
        pinFocusID: 0,
    };

    pinChange(id, value) {
        let _pins = this.state.pinCode
        _pins[id] = value

        // console.log(value);
        
        let _id = id
        if (value !== '') {
            if (_id < this.state.pinCode.length - 1) _id++
        } else {
            if (_id > 0) _id--
        }
        
        document.getElementById(`pin${_id}`).focus()

        this.setState({
            pinCode: _pins,
            pinFocusID: _id,
        })
    }

    formPin(id) {
        return (
            <div className={`form-pin-fields__pin-box${this.state.pinCode[id] !== '' ? ' form-pin-active' : ''}`}>
                <input id={`pin${id}`} type="numer" name={`pin${id}`} value={this.state.pinCode[id] ?? ''} onChange={(e) => this.pinChange(id, e.target.value)}/>
                <label htmlFor={`pin${id}`}></label>
            </div>
        )
    }

    handleSubmit = e => {
        e.preventDefault();
        e.stopPropagation()

        const { onSend, onClose } = this.props;

        // передаём поля из формы без поля maxAmount
        onSend((({ maxAmount, ...rest }) => rest)(this.state));
        onClose();

        this.setState({
            mode: 'CBS',
            sendTo: '',
            amount: '',
            maxAmount: 10.34,
            memo: '',
            pinCode: ['', '', '', '' ,'', ''],
            pinFocusID: 0,
        });
    };

    handleChange = ({ target: { name, value } }) => {
        this.setState({
            [name]: value
        })
    };

    render() {
        const { opened, onClose, title, balances } = this.props;
        const {
            mode,
            sendTo,
            amount,
            memo
        } = this.state;

        const maxSend = mode === 'CBS' ? balances.cbs : balances.cbsch
        // console.log(`Max send`, maxSend, 'balances', balances, "mode", mode)

        return (
            <PopupWrapper
                opened={ opened }
                title={ title }
                className="send-popup"
                onClose={ onClose }>
                <form className="send-popup__form" onSubmit={ this.handleSubmit }>
                    <Switcher
                        className="send-popup__form__switcher"
                        name="mode"
                        value={ mode }
                        onChange={ this.handleChange } />
                    <Input
                        className="send-popup__form__input--send-to"
                        name="sendTo"
                        value={ sendTo }
                        label="Send to"
                        onChange={ this.handleChange } />
                    <Input
                        className="send-popup__form__input"
                        name="amount"
                        value={ amount }
                        label={`Amount, ${mode}`}
                        maxValue={ maxSend }
                        type="number"
                        onChange={ this.handleChange } />
                    <Input
                        className="send-popup__form__input"
                        name="memo"
                        value={ memo }
                        label="Memo"
                        onChange={ this.handleChange } />
                    <div className="form-pin-fields">
                        {this.formPin(0)}
                        {this.formPin(1)}
                        {this.formPin(2)}
                        {this.formPin(3)}
                        {this.formPin(4)}
                        {this.formPin(5)}
                    </div>
                    <div className="send-popup__btn-container">
                        <button className="send-popup__btn-send">
                            <WalletSendIcon />
                            <span>Send</span>
                        </button>
                    </div>
                </form>
            </PopupWrapper>
        )
    }
}

export default SendPopup