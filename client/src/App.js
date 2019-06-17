import React, { useState, useRef } from "react";
import Toolbar from "./Toolbar";
import ShareDB from "sharedb/lib/client";
import StringBinding from "sharedb-string-binding";

const COLLECTION_NAME = "sdbeditor";
const DOCUMENT_NAME = "example";

let ws, conn, doc;

function App() {
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("NOT CONNECTED.");
    const editorRef = useRef();

    function handleConnect(url) {
        // Connect to the websocket address
        ws = new WebSocket(url);
        setStatus("Connecting to address...");

        // Handle error connections
        ws.addEventListener("error", function onError() {
            setStatus("Failed to connect!");
        });

        ws.addEventListener("open", function onOpen() {
            setStatus("Connected.");

            // Initialize the ShareDB interface over the websocket connection
            conn = new ShareDB.Connection(ws);

            // Retrieve the editing document from ShareDB
            doc = conn.get(COLLECTION_NAME, DOCUMENT_NAME);
            console.log(doc);
            if (doc.type === null) {
                doc.create("This is some initial data...");
            }

            // Subscribe and listen to changes
            doc.subscribe(function(err) {
                console.log(err);
                if (err) throw err;
                console.log(editorRef, doc);
                const binding = new StringBinding(editorRef, doc, ["content"]);
                console.log(binding);
                binding.setup();
            });
        });

        ws.addEventListener("close", function onClose() {
            // Close the editing document, if it still exists
            if (doc) {
                doc.destroy();
            }
            setStatus("Closed.");
        });
    }

    return (
        <main>
            <h3>ShareDB Editor</h3>
            <Toolbar onConnect={handleConnect} status={status} />
            <textarea className="textarea" ref={editorRef} />
        </main>
    );
}

export default App;
