import React from 'react';
import './Button.css';

function Button({
  buttonText,
  buttonClass,
  handleClick,
  id,
}) {
  return (
    <button type="button" className={`reusableButton ${buttonClass}`} id={id} onClick={handleClick}>{buttonText}</button>
  );
}

export default Button;
