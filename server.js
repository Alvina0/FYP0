const express = require('express');
const path = require('path');
const app = express();
const port = 3000; 

app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));


app.use(express.static(path.join(__dirname, '../Frontend')));

// Start the server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend', 'main.html'));
});

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));