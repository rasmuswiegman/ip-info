const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

function getAllIPAddresses(req) {
  const ips = new Set();

  // Collect IPs from x-forwarded-for header (might contain multiple IPs)
  if (req.headers['x-forwarded-for']) {
    req.headers['x-forwarded-for'].split(',').forEach(ip => {
      const trimmedIP = ip.trim();
      if (trimmedIP) ips.add(`x-forwarded-for: ${trimmedIP}`);
    });
  }

  // Collect IP from connection remote address
  if (req.connection.remoteAddress) {
    ips.add(`connection.remoteAddress: ${req.connection.remoteAddress}`);
  }

  // Collect IP from socket remote address
  if (req.socket.remoteAddress) {
    ips.add(`socket.remoteAddress: ${req.socket.remoteAddress}`);
  }

  // Collect IP from connection socket remote address
  if (req.connection.socket && req.connection.socket.remoteAddress) {
    ips.add(`connection.socket.remoteAddress: ${req.connection.socket.remoteAddress}`);
  }

  // Additional headers that might contain IP information
  const additionalIPHeaders = [
    'x-real-ip',
    'x-client-ip',
    'x-forwarded',
    'forwarded-for',
    'forwarded'
  ];

  additionalIPHeaders.forEach(header => {
    const headerValue = req.headers[header];
    if (headerValue) {
      ips.add(`${header}: ${headerValue}`);
    }
  });

  return Array.from(ips);
}

app.get('/', (req, res) => {
  const ipAddresses = getAllIPAddresses(req);
  
  // Send HTML response with all IP addresses
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Your IP Addresses</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #244433;
            color: #4CAF50;
            padding: 20px;
          }
          .container {
            text-align: center;
            padding: 20px;
            background-color: #356052;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            max-width: 800px;
            width: 100%;
          }
          h1 {
            color: #172e35;
          }
          .ip-list {
            text-align: left;
            margin-top: 20px;
            background-color: #2a4d3e;
            padding: 15px;
            border-radius: 5px;
          }
          .ip-item {
            margin: 10px 0;
            word-break: break-all;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Your IP Addresses</h1>
          <div class="ip-list">
            ${ipAddresses.length > 0 
              ? ipAddresses.map(ip => `<div class="ip-item">${ip}</div>`).join('') 
              : '<div class="ip-item">No IP addresses found</div>'}
          </div>
        </div>
      </body>
    </html>
  `);
});

// Similar route for '/test'
app.get('/test', (req, res) => {
  const ipAddresses = getAllIPAddresses(req);
  
  // Send HTML response with all IP addresses
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Your IP Addresses</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #244433;
            color: #4CAF50;
            padding: 20px;
          }
          .container {
            text-align: center;
            padding: 20px;
            background-color: #356052;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            max-width: 800px;
            width: 100%;
          }
          h1 {
            color: #172e35;
          }
          .ip-list {
            text-align: left;
            margin-top: 20px;
            background-color: #2a4d3e;
            padding: 15px;
            border-radius: 5px;
          }
          .ip-item {
            margin: 10px 0;
            word-break: break-all;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Your IP Addresses</h1>
          <div class="ip-list">
            ${ipAddresses.length > 0 
              ? ipAddresses.map(ip => `<div class="ip-item">${ip}</div>`).join('') 
              : '<div class="ip-item">No IP addresses found</div>'}
          </div>
        </div>
      </body>
    </html>
  `);
});

// Route for plain text IP addresses
app.get('/ip', (req, res) => {
  const ipAddresses = getAllIPAddresses(req);
  
  // Set content type to plain text
  res.setHeader('Content-Type', 'text/plain');
  
  // Only send the first IP address
  if (ipAddresses.length > 0) {
    // Extract just the IP part (after the colon and space)
    const firstIP = ipAddresses[0].split(': ')[1];
    res.send(firstIP);
  } else {
    res.send('No IP address found');
  }
});

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
