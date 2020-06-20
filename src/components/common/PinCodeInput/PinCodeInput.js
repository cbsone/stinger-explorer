import React, { Component } from "react";
import cx from 'classnames'
import './PinCodeInput.sass'

const PinItem = React.forwardRef(function({ onChange, value, onUpdateFocus, onClear, disabled, error, secure, index }, ref) {

    const pinClassNames = cx(
        'component-pin-code_items_item', {
            'component-pin-code_items_item--disabled': disabled,
            'component-pin-code_items_item--error': error,
        }
    );
    
    function handleKeydown({ keyCode }) {
        if (keyCode === 8) {
            onClear()
        }
    }

    function handleFocus() {
        onUpdateFocus()
    }
    
    return (
        <input
            name={ secure ? `pin-secure-${index}` : `pin-${index}` }
            autoComplete="off"
            ref={ ref }
            value={ value }
            onChange={ onChange }
            onKeyDown={ handleKeydown }
            onFocus={ handleFocus }
            className={ pinClassNames }
            type={ secure ? 'password' : 'number' } />
    )
});

class PinCodeInput extends Component{

    state = {
        values: ['', '', '', '', '', ''],
        currentFocus: 0
    };

    elements = [];

    handlePinChange = i => ({ target: { value } }) => {
        const { name, onChange } = this.props;
        const { values, currentFocus } = this.state;
        
        let updatePinCode = true;
        let newValues = [...values];
        let newPinValue = value.length === 2 ? value.toString()[1] : value;
        
        newValues[i] = newPinValue;
        
        this.setState({
            values: newValues,
        });


        if (currentFocus < this.elements.length - 1 && newPinValue !== '') {
            this.elements[currentFocus + 1].focus();
            newValues[currentFocus + 1] = '';

            this.setState({
                currentFocus: currentFocus + 1
            })
        }

        // newValues.forEach(v => {
        //     if (v === '') updatePinCode = false
        // });

        if (updatePinCode)
            onChange({ target: { name, value: newValues.join('') } });
        else
            onChange({ target: { name, value: '' } });
    };

    handleUpdateCurrentFocus = i => () => {
        this.setState({
            currentFocus: i
        })
    };

    handleClearPinValue = i => () => {
        const { values, currentFocus } = this.state;
        let newValues = [...values];

        newValues[i] = '';

        if (currentFocus > 0) {
            this.elements[currentFocus - 1].focus()
        }

        this.setState({
            values: newValues
        });

    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.value !== prevState.values) {
            const { value } = nextProps;
            return { values: Array(6).fill('').map((x, i) => value[i] || '') }
        }

        return null
    }

    componentDidMount() {
        const { value } = this.props;

        const initialValues = Array(6).fill('').map((x, i) => value[i] || '');

        this.setState({
            values: initialValues
        })
    }

    render() {
        const { className, title, disabled = false, error = false, secure = false } = this.props;
        const { values } = this.state;

        const pinItems = values.map((v, i) => (
            <PinItem
                ref={ n => (this.elements[i] = n) }
                key={ i }
                index={ i }
                value={ v.slice(-1) }
                disabled={ disabled }
                error={ error }
                secure={ secure }
                onUpdateFocus={ this.handleUpdateCurrentFocus(i) }
                onClear={ this.handleClearPinValue(i) }
                onChange={ this.handlePinChange(i) } />
        ));

        return (
            <div className={ cx(className, 'component-pin-code') }>
                {
                    title &&
                    <p className="component-pin-code__title">{ title }</p>
                }
                <div className="component-pin-code_items">
                    { pinItems }
                </div>
            </div>
        )
    }
}

export default PinCodeInput
