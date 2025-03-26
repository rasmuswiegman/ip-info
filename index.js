const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

function getIPSource(req) {
  if (req.headers['x-forwarded-for']) {
    return { 
      ip: req.headers['x-forwarded-for'].split(',')[0].trim(),
      source: 'x-forwarded-for header'
    };
  }
  if (req.connection.remoteAddress) {
    return { 
      ip: req.connection.remoteAddress,
      source: 'connection remote address'
    };
  }
  if (req.socket.remoteAddress) {
    return { 
      ip: req.socket.remoteAddress,
      source: 'socket remote address'
    };
  }
  if (req.connection.socket && req.connection.socket.remoteAddress) {
    return { 
      ip: req.connection.socket.remoteAddress,
      source: 'connection socket remote address'
    };
  }
  return { 
    ip: null, 
    source: 'no source found' 
  };
}

app.get('/', (req, res) => {
  const { ip, source } = getIPSource(req);
  
  // Extract IPv4 address
  let processedIP = ip;
  if (processedIP) {
    // If it's IPv4 mapped in IPv6 (::ffff:192.168.0.1), extract just the IPv4 part
    if (processedIP.includes('::ffff:')) {
      processedIP = processedIP.split('::ffff:')[1];
    }
    // If it contains a port, remove it
    if (processedIP.includes(':')) {
      const parts = processedIP.split(':');
      // Check if it looks like an IPv4 address with port
      if (parts.length === 2 && parts[0].split('.').length === 4) {
        processedIP = parts[0];
      }
    }
  }
  
  // Send HTML response with the IP address and its source
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
          .ip, .source {
            font-size: 24px;
            font-weight: bold;
            color: #172e35;
            margin: 20px 0;
          }
          .source {
            font-size: 16px;
            color: #4CAF50;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Your IP Address</h1>
          <div class="source">Source: ${source}</div>
          <div class="ip">${processedIP || 'Unable to retrieve IP'}</div>
        </div>
      </body>
    </html>
  `);
});

// Identical logic for '/test' route
app.get('/test', (req, res) => {
  const { ip, source } = getIPSource(req);
  
  // Extract IPv4 address
  let processedIP = ip;
  if (processedIP) {
    // If it's IPv4 mapped in IPv6 (::ffff:192.168.0.1), extract just the IPv4 part
    if (processedIP.includes('::ffff:')) {
      processedIP = processedIP.split('::ffff:')[1];
    }
    // If it contains a port, remove it
    if (processedIP.includes(':')) {
      const parts = processedIP.split(':');
      // Check if it looks like an IPv4 address with port
      if (parts.length === 2 && parts[0].split('.').length === 4) {
        processedIP = parts[0];
      }
    }
  }
  
  // Send HTML response with the IP address and its source
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
          .ip, .source {
            font-size: 24px;
            font-weight: bold;
            color: #172e35;
            margin: 20px 0;
          }
          .source {
            font-size: 16px;
            color: #4CAF50;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Your IP Address</h1>
          <div class="source">Source: ${source}</div>
          <div class="ip">${processedIP || 'Unable to retrieve IP'}</div>
        </div>
      </body>
    </html>
  `);
});

// Route for plain text IP with source
app.get('/ip', (req, res) => {
  const { ip, source } = getIPSource(req);
  
  // Extract IPv4 address
  let processedIP = ip;
  if (processedIP) {
    // If it's IPv4 mapped in IPv6 (::ffff:192.168.0.1), extract just the IPv4 part
    if (processedIP.includes('::ffff:')) {
      processedIP = processedIP.split('::ffff:')[1];
    }
    // If it contains a port, remove it
    if (processedIP.includes(':')) {
      const parts = processedIP.split(':');
      // Check if it looks like an IPv4 address with port
      if (parts.length === 2 && parts[0].split('.').length === 4) {
        processedIP = parts[0];
      }
    }
  }
  
  // Set content type to plain text
  res.setHeader('Content-Type', 'text/plain');
  res.send(`IP: ${processedIP || 'Unable to retrieve IP'}\nSource: ${source}`);
});

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
