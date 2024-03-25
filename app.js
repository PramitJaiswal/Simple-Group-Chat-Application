const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve the login form
app.get('/login', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login</title>
        </head>
        <body>
            <h2>Login</h2>
            <form action="/login" method="POST">
                <label for="username">Username:</label><br>
                <input type="text" id="username" name="username"><br>
                <input type="submit" value="Submit">
            </form>
        </body>
        </html>
    `);
});

// Handle form submission
app.post('/login', (req, res) => {
    const username = req.body.username;
    res.cookie('username', username);
    res.redirect('/');
});

// Serve the home page
app.get('/', (req, res) => {
    fs.readFile('msg.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading messages');
        }
        const username = req.cookies.username || 'Anonymous';
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Chat</title>
            </head>
            <body>
                <h2>Welcome to the chat</h2>
                <div id="messages">
                    ${data || ''}
                </div>
                <input type="text" id="message" placeholder="Type your message">
                <button onclick="sendMessage()">Send</button>
                <script>
                    function sendMessage() {
                        const message = document.getElementById('message').value;
                        const username = "${username}";
                        const fullMessage = "<p><strong>" + username + ":</strong> " + message + "</p>";
                        document.getElementById('messages').innerHTML += fullMessage;
                        // Save the message to the file
                        const fs = require('fs');
                        fs.appendFile('msg.txt', fullMessage, (err) => {
                            if (err) {
                                console.error(err);
                            }
                        });
                    }
                </script>
            </body>
            </html>
        `);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
