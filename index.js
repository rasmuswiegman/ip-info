const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  // IP Retrieval Sources:
  // 1. 'x-forwarded-for': Used when the app is behind a proxy (e.g., Nginx, load balancer)
  //    - Typically contains the original client IP in a comma-separated list
  // 2. req.connection.remoteAddress: Connection's remote IP address (legacy method)
  // 3. req.socket.remoteAddress: Socket's remote IP address (modern method)
  // 4. req.connection.socket.remoteAddress: Fallback for older Node.js versions
  let ip = req.headers['x-forwarded-for'] || // Source: Proxy header
           req.connection.remoteAddress ||   // Source: Connection object
           req.socket.remoteAddress ||       // Source: Socket object
           (req.connection.socket ? req.connection.socket.remoteAddress : null); // Source: Fallback connection socket
  
  // Extract IPv4 address
  if (ip) {
    // If it's IPv4 mapped in IPv6 (::ffff:192.168.0.1), extract just the IPv4 part
    if (ip.includes('::ffff:')) {
      ip = ip.split('::ffff:')[1];
    }
    // If it contains a port, remove it
    if (ip.includes(':')) {
      const parts = ip.split(':');
      // Check if it looks like an IPv4 address with port
      if (parts.length === 2 && parts[0].split('.').length === 4) {
        ip = parts[0];
      }
    }
  }
  
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

// Identical modifications for '/test' route
app.get('/test', (req, res) => {
  // IP Retrieval Sources:
  // 1. 'x-forwarded-for': Used when the app is behind a proxy (e.g., Nginx, load balancer)
  //    - Typically contains the original client IP in a comma-separated list
  // 2. req.connection.remoteAddress: Connection's remote IP address (legacy method)
  // 3. req.socket.remoteAddress: Socket's remote IP address (modern method)
  // 4. req.connection.socket.remoteAddress: Fallback for older Node.js versions
  let ip = req.headers['x-forwarded-for'] || // Source: Proxy header
           req.connection.remoteAddress ||   // Source: Connection object
           req.socket.remoteAddress ||       // Source: Socket object
           (req.connection.socket ? req.connection.socket.remoteAddress : null); // Source: Fallback connection socket
  
  // Extract IPv4 address
  if (ip) {
    // If it's IPv4 mapped in IPv6 (::ffff:192.168.0.1), extract just the IPv4 part
    if (ip.includes('::ffff:')) {
      ip = ip.split('::ffff:')[1];
    }
    // If it contains a port, remove it
    if (ip.includes(':')) {
      const parts = ip.split(':');
      // Check if it looks like an IPv4 address with port
      if (parts.length === 2 && parts[0].split('.').length === 4) {
        ip = parts[0];
      }
    }
  }
  
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

// Identical modifications for '/ip' route
app.get('/ip', (req, res) => {
  // IP Retrieval Sources:
  // 1. 'x-forwarded-for': Used when the app is behind a proxy (e.g., Nginx, load balancer)
  //    - Typically contains the original client IP in a comma-separated list
  // 2. req.connection.remoteAddress: Connection's remote IP address (legacy method)
  // 3. req.socket.remoteAddress: Socket's remote IP address (modern method)
  // 4. req.connection.socket.remoteAddress: Fallback for older Node.js versions
  let ip = req.headers['x-forwarded-for'] || // Source: Proxy header
           req.connection.remoteAddress ||   // Source: Connection object
           req.socket.remoteAddress ||       // Source: Socket object
           (req.connection.socket ? req.connection.socket.remoteAddress : null); // Source: Fallback connection socket
  
  // Extract IPv4 address
  if (ip) {
    // If it's IPv4 mapped in IPv6 (::ffff:192.168.0.1), extract just the IPv4 part
    if (ip.includes('::ffff:')) {
      ip = ip.split('::ffff:')[1];
    }
    // If it contains a port, remove it
    if (ip.includes(':')) {
      const parts = ip.split(':');
      // Check if it looks like an IPv4 address with port
      if (parts.length === 2 && parts[0].split('.').length === 4) {
        ip = parts[0];
      }
    }
  }
  // Set content type to plain text
  res.setHeader('Content-Type', 'text/plain');
  res.send(ip);
});

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
