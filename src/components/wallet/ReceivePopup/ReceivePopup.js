import React, { Component } from "react";
import QRCode from 'qrcode.react';
import './ReceivePopup.sass'
import PopupWrapper from "../../common/PopupWrapper/PopupWrapper";
import CopyButton from "../../common/CopyButton/CopyButton";
import {ReactComponent as ShareIcon} from "../../../assets/svg/share-icon.svg";

export default class ReceivePopup extends Component {
    state = {
    };

    render() {
        const { opened, onClose, title, account } = this.props;

        const copyValue = `${account ? account.name : ''}@${account ? account.key : ''}`;


        return (
            <PopupWrapper
                opened={ opened }
                title={ title }
                className="send-popup"
                onClose={ onClose }>
                <div style={{textAlign: 'center', paddingTop: '25px', paddingBottom: '25px'}}>
                    <QRCode value={ copyValue } style={{width: '256px', height: '256px', margin: 'auto'}}/>
                </div>
                <div className="receive-popup__text-field">
                    <p className="receive-popup__text-field__label">Your key</p>
                    <div className="receive-popup__text-field__value-container">
                        <p className="receive-popup__text-field__value">{ copyValue }</p>
                        <CopyButton className="receive-popup__text-field__btn-copy" value={ copyValue } />
                    </div>
                </div>
                <button className="send-popup__btn-send receive-popup__btn-share">
                    <ShareIcon />
                    <span>Share</span>
                </button>
            </PopupWrapper>
        )
    }
}