import React, { Component } from "react"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import cx from 'classnames'
import './CopyButton.sass'
// import { ReactComponent as CopyIcon } from '../../../assets/svg/copy-icon.svg'

// function CopyButton({ className, value }) {
    
//     function handleCopy(v) {
//         let textArea = document.createElement("textarea");
//         textArea.value = v;

//         textArea.style.top = "0";
//         textArea.style.left = "0";
//         textArea.style.position = "fixed";
//         textArea.style.width = "0";
//         textArea.style.height = "0";
//         textArea.style.opacity = "0";

//         document.body.appendChild(textArea);

//         textArea.focus();
//         textArea.select();

//         try {
//             let successful = document.execCommand('copy');
//             // let msg = successful ? 'successful' : 'unsuccessful';
//             // console.log('Fallback: Copying text command was ' + msg);
//         } catch (err) {
//             // console.error('Fallback: Oops, unable to copy', err);
//         }

//         document.body.removeChild(textArea);
//     }
    
//     return (
//         <button className={ cx(className, 'component-copy-button') } onClick={ () => handleCopy(value) }>
//             {/* <CopyIcon /> */}
//         </button>
//     )
// }

// export default CopyButton

export default class CopyButton extends Component {
    constructor(props) {
        super(props)

        this.state = {
            className: props.className,
            value: props.value,
            showTooltip: false,
            onCopy: props.onCopy,
        }

        this.onClick = this.onClick.bind(this)
    }

    onClick() {
        if (this.state.showTooltip) return

        this.setState({ showTooltip: true })

        const close = () => this.setState({ showTooltip: false })
        setTimeout(close, 2000)

        if (this.state.onCopy) this.state.onCopy()
    }

    render() {
        return (
            <CopyToClipboard text={ this.state.value }>
                <div className="popup-botton-container">
                    <div className="copy-icon" onClick={ this.onClick }></div>
                    <div className={ cx('button-tooltip', { 'button-tooltip-show' : this.state.showTooltip }) }><span>Скопировано</span></div>
                </div>
            </CopyToClipboard>
        )
    }
}