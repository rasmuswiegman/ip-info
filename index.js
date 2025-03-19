const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  // Get the visitor's IP address
  const ip = req.headers['x-forwarded-for'] || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress || 
             (req.connection.socket ? req.connection.socket.remoteAddress : null);
  
  // Send HTML response with the IP address (dark theme with green text)
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
            background-color: #244433;
            color: #4CAF50;
          }
          .container {
            text-align: center;
            padding: 20px;
            background-color: #356052;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          }
          h1 {
            color: #172e35;
          }
          .ip {
            font-size: 24px;
            font-weight: bold;
            color: #172e35;
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

// Add a route to the test site
app.get('/test', (req, res) => {
  // Get the visitor's IP address
  const ip = req.headers['x-forwarded-for'] || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress || 
             (req.connection.socket ? req.connection.socket.remoteAddress : null);
  
  // Send HTML response with the IP address (dark theme with green text)
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
            background-color: #244433;
            color: #4CAF50;
          }
          .container {
            text-align: center;
            padding: 20px;
            background-color: #356052;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          }
          h1 {
            color: #172e35;
          }
          .ip {
            font-size: 24px;
            font-weight: bold;
            color: #172e35;
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


// Add a route for ip that shows just the IP address as plain text
app.get('/ip', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress || 
             (req.connection.socket ? req.connection.socket.remoteAddress : null);
  
  // Set content type to plain text
  res.setHeader('Content-Type', 'text/plain');
  res.send(ip);
});

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
