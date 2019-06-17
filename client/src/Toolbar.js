import React, { useState } from "react";

function Toolbar(props) {
    const [url, setURL] = useState("");

    function onChangeURL(e) {
        setURL(e.target.value);
    }

    function onConnect() {
        props.onConnect(url);
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Enter server URL..."
                onChange={onChangeURL}
                value={url}
            />
            <button type="button" onClick={onConnect}>
                Connect
            </button>
            <strong className="status">Status: {props.status}</strong>
        </div>
    );
}

export default Toolbar;
