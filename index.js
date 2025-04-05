const express = require('express'); // Import the express module. Use "require" keyword to get access to the Express library.
const app = express(); // Create an instance of an Express application. This app instance will be used to configure the server and define routes.

app.get('/', (req, res) => {
    res.send({ hi: 'there' });
});


const PORT = process.env.PORT || 5001; // Look at the underlying environment and see if they have declared a port for us to use.
// app.listen(5001); // Start the server and listen on port 5000. The server will listen for incoming requests on this port.

console.log(`Received PORT from environment: ${process.env.PORT}, Effective PORT: ${PORT}`);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Log a message to the console indicating that the server is running and on which port.
});