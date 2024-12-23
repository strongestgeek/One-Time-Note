const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const path = require('path');
const base62 = require('base62/lib/ascii'); // Use Base62 encoding

const app = express();
const PORT = 3000;

// Use your custom domain
const BASE_URL = 'https://your.notes.url.com';

app.use(bodyParser.json());
app.use(express.static('public'));

// Serve index.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let notes = {};

// Helper function to convert UUID to Base62
function uuidToBase62(uuid) {
    // Remove dashes from the UUID
    const hexString = uuid.replace(/-/g, '');

    // Convert hex string to a BigInt
    const bigInt = BigInt('0x' + hexString);

    // Convert BigInt to string and then encode the string to Base62
    return base62.encode(bigInt.toString());
}

app.post('/create-note', (req, res) => {
    const note = req.body.note;
    const id = uuidv4();
    const shortId = uuidToBase62(id);
    notes[shortId] = note;
    res.json({ link: `${BASE_URL}/note/${shortId}` });
});

app.get('/note/:id', (req, res) => {
    const id = req.params.id;
    if (notes[id]) {
        res.send(`
            <html>
            <head>
                <title>One-Time Note</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: #f0f0f0;
                        margin: 0;
                    }
                    .container {
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        text-align: center;
                        max-width: 500px;
                        width: 100%;
                    }
                    button {
                        margin-top: 20px;
                        padding: 10px 20px;
                        background-color: #007BFF;
                        color: #fff;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    button:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>One-Time Note</h1>
                    <p>This is a one-time note. Viewing it now will prevent future access.</p>
                    <button onclick="viewNote()">View Note</button>
                </div>
                <script>
                    function viewNote() {
                        fetch(window.location.href, {
                            method: 'POST'
                        })
                        .then(response => response.text())
                        .then(html => {
                            document.body.innerHTML = html;
                        });
                    }
                </script>
            </body>
            </html>
        `);
    } else {
        res.status(404).send(`
            <html>
            <head>
                <title>Note Not Found</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: #f0f0f0;
                        margin: 0;
                    }
                    .container {
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        text-align: center;
                        max-width: 500px;
                        width: 100%;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Note Not Found</h1>
                    <p>The note was not found or has already been viewed.</p>
                </div>
            </body>
            </html>
        `);
    }
});

app.post('/note/:id', (req, res) => {
    const id = req.params.id;
    if (notes[id]) {
        const note = notes[id];
        delete notes[id];
        res.send(`
            <html>
            <head>
                <title>Note</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: #f0f0f0;
                        margin: 0;
                    }
                    .container {
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        text-align: center;
                        max-width: 500px;
                        width: 100%;
                    }
                    pre {
                        text-align: left;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        background-color: #f8f8f8;
                        padding: 10px;
                        border-radius: 4px;
                        border: 1px solid #ddd;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>This is your one-time note</h1>
                    <pre>${note}</pre>
                </div>
            </body>
            </html>
        `);
    } else {
        res.status(404).send(`
            <html>
            <head>
                <title>Note Not Found</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: #f0f0f0;
                        margin: 0;
                    }
                    .container {
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        text-align: center;
                        max-width: 500px;
                        width: 100%;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Note Not Found</h1>
                    <p>The note was not found or has already been viewed.</p>
                </div>
            </body>
            </html>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
