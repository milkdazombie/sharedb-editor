const ShareDB = require("sharedb");
const WebSocket = require("ws");
const WebSocketJSONStream = require("@teamwork/websocket-json-stream");

// The port that the websocket server will listen on
const SERVER_PORT = 8000;

// The collection and document name (must be same on client-side)
const COLLECTION_NAME = "sdbeditor";
const DOCUMENT_NAME = "example";

const share = new ShareDB({ disableDocAction: true, disableSpaceDelimitedActions: true });
const wss = new WebSocket.Server({ port: SERVER_PORT });

// Create the initial editing document
const conn = share.connect();
const doc = conn.get(COLLECTION_NAME, DOCUMENT_NAME);
doc.fetch(function(err) {
    if (err) throw err;
    if (doc.type === null) {
        doc.create("This is some initial data.");
        return;
    }
});

// WebSocket Server events
wss.on("connection", function(ws) {
    const stream = new WebSocketJSONStream(ws);
    share.listen(stream);
});

// ShareDB events
share.use("connect", function(ctx) {
    console.log("New client connected:" + ctx.agent.clientId);
});

console.log("Server is now listening on :" + SERVER_PORT);
