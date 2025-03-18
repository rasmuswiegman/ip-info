const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  // Get the visitor's IP address
  const ip = req.headers['x-forwarded-for'] || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress || 
             (req.connection.socket ? req.connection.socket.remoteAddress : null);
  
  // Send HTML response with the IP address
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Your IP Address</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
          }
          .container {
            text-align: center;
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
          }
          .ip {
            font-size: 24px;
            font-weight: bold;
            color: #0078d4;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Your IP Address</h1>
          <div class="ip">${ip}</div>
        </div>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});