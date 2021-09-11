import * as React from "react";

export default function Form({submitHandler, changeHandler, defaultMessage}) {

  const handleChange = (event) => {
    changeHandler(event.target.value);
  }

  return <form onSubmit={submitHandler}>
    <label>
      <input type="text" autoFocus placeholder="Type your message here" value={defaultMessage} onChange={handleChange} />
    </label>
    <button className="button waveButton">
    Wave at Me
    </button>
  </form>
}