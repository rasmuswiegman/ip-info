const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

function getIPDetails(req) {
  // Collect all potential IP sources
  const ipSources = {
    'x-forwarded-for': req.headers['x-forwarded-for'],
    'connection.remoteAddress': req.connection.remoteAddress,
    'socket.remoteAddress': req.socket.remoteAddress,
    'connection.socket.remoteAddress': req.connection.socket ? req.connection.socket.remoteAddress : null
  };

  // Find the first non-null IP
  let selectedIP = null;
  let selectedSource = null;

  for (const [sourceName, ip] of Object.entries(ipSources)) {
    if (ip) {
      selectedIP = ip;
      selectedSource = sourceName;
      break;
    }
  }

  // Process the IP to clean it up
  let processedIP = selectedIP;
  if (processedIP) {
    // Handle x-forwarded-for which might contain multiple IPs
    if (sourceName === 'x-forwarded-for') {
      processedIP = processedIP.split(',')[0].trim();
    }

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

  return {
    originalIP: selectedIP,
    processedIP: processedIP,
    source: selectedSource,
    allSources: ipSources
  };
}

app.get('/', (req, res) => {
  const ipDetails = getIPDetails(req);
  
  // Send HTML response with detailed IP information
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Your IP Address Details</title>
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
            max-width: 600px;
            width: 90%;
          }
          h1 {
            color: #172e35;
          }
          .ip, .source {
            font-size: 18px;
            font-weight: bold;
            color: #172e35;
            margin: 10px 0;
            word-break: break-all;
          }
          .source-details {
            font-size: 14px;
            color: #4CAF50;
            text-align: left;
            margin-top: 20px;
          }
          .source-details div {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Your IP Address Details</h1>
          <div class="ip">Processed IP: ${ipDetails.processedIP || 'Unable to retrieve IP'}</div>
          <div class="ip">Original IP: ${ipDetails.originalIP || 'Unable to retrieve IP'}</div>
          <div class="source">Primary Source: ${ipDetails.source}</div>
          <div class="source-details">
            <div>x-forwarded-for: ${ipDetails.allSources['x-forwarded-for'] || 'Not present'}</div>
            <div>connection.remoteAddress: ${ipDetails.allSources['connection.remoteAddress'] || 'Not present'}</div>
            <div>socket.remoteAddress: ${ipDetails.allSources['socket.remoteAddress'] || 'Not present'}</div>
            <div>connection.socket.remoteAddress: ${ipDetails.allSources['connection.socket.remoteAddress'] || 'Not present'}</div>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Similar route for '/test'
app.get('/test', (req, res) => {
  const ipDetails = getIPDetails(req);
  
  // Send HTML response with detailed IP information
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Your IP Address Details</title>
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
            max-width: 600px;
            width: 90%;
          }
          h1 {
            color: #172e35;
          }
          .ip, .source {
            font-size: 18px;
            font-weight: bold;
            color: #172e35;
            margin: 10px 0;
            word-break: break-all;
          }
          .source-details {
            font-size: 14px;
            color: #4CAF50;
            text-align: left;
            margin-top: 20px;
          }
          .source-details div {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Your IP Address Details</h1>
          <div class="ip">Processed IP: ${ipDetails.processedIP || 'Unable to retrieve IP'}</div>
          <div class="ip">Original IP: ${ipDetails.originalIP || 'Unable to retrieve IP'}</div>
          <div class="source">Primary Source: ${ipDetails.source}</div>
          <div class="source-details">
            <div>x-forwarded-for: ${ipDetails.allSources['x-forwarded-for'] || 'Not present'}</div>
            <div>connection.remoteAddress: ${ipDetails.allSources['connection.remoteAddress'] || 'Not present'}</div>
            <div>socket.remoteAddress: ${ipDetails.allSources['socket.remoteAddress'] || 'Not present'}</div>
            <div>connection.socket.remoteAddress: ${ipDetails.allSources['connection.socket.remoteAddress'] || 'Not present'}</div>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Route for plain text IP with source details
app.get('/ip', (req, res) => {
  const ipDetails = getIPDetails(req);
  
  // Set content type to plain text
  res.setHeader('Content-Type', 'text/plain');
  res.send(`Processed IP: ${ipDetails.processedIP || 'Unable to retrieve IP'}
Original IP: ${ipDetails.originalIP || 'Unable to retrieve IP'}
Primary Source: ${ipDetails.source}

Detailed Sources:
x-forwarded-for: ${ipDetails.allSources['x-forwarded-for'] || 'Not present'}
connection.remoteAddress: ${ipDetails.allSources['connection.remoteAddress'] || 'Not present'}
socket.remoteAddress: ${ipDetails.allSources['socket.remoteAddress'] || 'Not present'}
connection.socket.remoteAddress: ${ipDetails.allSources['connection.socket.remoteAddress'] || 'Not present'}`);
});

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
