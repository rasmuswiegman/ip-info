const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Set the timezone for the server logs
process.env.TZ = 'Europe/Copenhagen';
console.log(`Server timezone set to: ${process.env.TZ}`);

// Add basic error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Enable trust proxy if behind a reverse proxy
app.set('trust proxy', true);

// Data structure to store IP history
// Format: { timestamp: Date, ip: String, headers: Object }
const ipHistory = [];

// Maximum history retention in milliseconds (7 days)
const MAX_HISTORY_AGE = 7 * 24 * 60 * 60 * 1000;

// Clean up old entries periodically (every hour)
setInterval(() => {
  const cutoffTime = Date.now() - MAX_HISTORY_AGE;
  const initialLength = ipHistory.length;
  
  // Remove entries older than 7 days
  while (ipHistory.length > 0 && ipHistory[0].timestamp < cutoffTime) {
    ipHistory.shift();
  }
  
  // Log with Copenhagen time
  const now = new Date().toLocaleString('en-US', {
    timeZone: 'Europe/Copenhagen',
    dateStyle: 'medium',
    timeStyle: 'medium'
  });
  
  console.log(`[${now}] History cleanup: removed ${initialLength - ipHistory.length} old entries`);
}, 60 * 60 * 1000);

function getAllIPAddresses(req) {
  const ips = new Set();

  // Collect IPs from x-forwarded-for header (might contain multiple IPs)
  if (req.headers['x-forwarded-for']) {
    req.headers['x-forwarded-for'].split(',').forEach(ip => {
      const trimmedIP = ip.trim();
      if (trimmedIP) ips.add(`x-forwarded-for: ${trimmedIP}`);
    });
  }

  // Collect IP from socket remote address (preferred method in Express 4+)
  if (req.socket && req.socket.remoteAddress) {
    ips.add(`socket.remoteAddress: ${req.socket.remoteAddress}`);
  }
  
  // Fallback to connection remote address (deprecated in newer Express versions)
  // Note: req.connection is deprecated in favor of req.socket in Express 4+
  try {
    if (req.connection && req.connection.remoteAddress) {
      ips.add(`connection.remoteAddress: ${req.connection.remoteAddress}`);
    }
  } catch (err) {
    console.log('Error accessing connection.remoteAddress:', err.message);
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

// Middleware to record IP information for all routes
app.use((req, res, next) => {
  try {
    const ipAddresses = getAllIPAddresses(req);
    
    // Create a safe copy of headers (prevent circular reference issues)
    const safeHeaders = {};
    for (const key in req.headers) {
      if (Object.prototype.hasOwnProperty.call(req.headers, key)) {
        // Ensure we only copy direct string properties
        try {
          const value = req.headers[key];
          if (typeof value === 'string' || Array.isArray(value)) {
            safeHeaders[key] = value;
          } else if (value !== null && value !== undefined) {
            safeHeaders[key] = String(value);
          }
        } catch (err) {
          safeHeaders[key] = '[Error reading header value]';
        }
      }
    }
    
    // Store visit in history
    ipHistory.push({
      timestamp: new Date(),
      path: req.path || '/',
      ip: ipAddresses.length > 0 ? ipAddresses[0] : 'Unknown',
      ipList: ipAddresses,
      userAgent: req.headers['user-agent'] || 'Unknown',
      headers: safeHeaders
    });
  } catch (err) {
    console.error('Error recording IP history:', err);
    // Don't block the request if history recording fails
  }
  
  next();
});

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
          nav {
            margin-top: 20px;
          }
          nav a {
            color: #8effb2;
            text-decoration: none;
            margin: 0 10px;
            padding: 5px 10px;
            border-radius: 4px;
            background-color: #172e35;
          }
          nav a:hover {
            background-color: #0c1a1e;
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
          <nav>
            <a href="/history">View 7-Day History</a>
          </nav>
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
          nav {
            margin-top: 20px;
          }
          nav a {
            color: #8effb2;
            text-decoration: none;
            margin: 0 10px;
            padding: 5px 10px;
            border-radius: 4px;
            background-color: #172e35;
          }
          nav a:hover {
            background-color: #0c1a1e;
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
          <nav>
            <a href="/history">View 7-Day History</a>
          </nav>
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

// New history route
app.get('/history', (req, res) => {
  // Format timestamps for display with Europe/Copenhagen timezone
  const formatDate = (date) => {
    try {
      // Format in Europe/Copenhagen timezone
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Europe/Copenhagen'
      };
      
      return new Date(date).toLocaleString('en-US', options);
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  // Group entries by day for better organization (using Copenhagen time)
  const groupedByDay = {};
  ipHistory.forEach(entry => {
    // Format the day using Copenhagen timezone
    const day = new Date(entry.timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      timeZone: 'Europe/Copenhagen'
    });
    
    if (!groupedByDay[day]) {
      groupedByDay[day] = [];
    }
    groupedByDay[day].push(entry);
  });

  // Generate days HTML
  const daysHtml = Object.keys(groupedByDay)
    .sort((a, b) => new Date(b) - new Date(a)) // Sort newest to oldest
    .map(day => {
      const entries = groupedByDay[day];
      const entriesHtml = entries
        .sort((a, b) => b.timestamp - a.timestamp) // Sort newest to oldest within day
        .map(entry => `
          <div class="history-entry">
            <div class="entry-time">${formatDate(entry.timestamp)}</div>
            <div class="entry-path">Path: ${entry.path}</div>
            <div class="entry-ip">IP: ${entry.ip}</div>
            <div class="entry-agent">User Agent: ${entry.userAgent}</div>
            <div class="entry-toggle" onclick="toggleDetails(this)">Show Details</div>
            <div class="entry-details" style="display:none;">
              <h4>All IPs:</h4>
              <ul>
                ${entry.ipList.map(ip => `<li>${ip}</li>`).join('')}
              </ul>
              <h4>Headers:</h4>
              <pre>${JSON.stringify(entry.headers, null, 2)}</pre>
            </div>
          </div>
        `).join('');

      return `
        <div class="history-day">
          <h3>${day}</h3>
          ${entriesHtml}
        </div>
      `;
    }).join('');

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>IP History - Last 7 Days</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            background-color: #244433;
            color: #4CAF50;
            padding: 20px;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background-color: #356052;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          }
          h1, h2, h3 {
            color: #172e35;
          }
          .history-day {
            margin-bottom: 30px;
            background-color: #2a4d3e;
            padding: 15px;
            border-radius: 5px;
          }
          .history-entry {
            margin: 15px 0;
            padding: 10px;
            background-color: #3c6359;
            border-radius: 5px;
          }
          .entry-time {
            font-weight: bold;
            margin-bottom: 5px;
          }
          .entry-path, .entry-ip, .entry-agent {
            margin-bottom: 5px;
            word-break: break-all;
          }
          .entry-toggle {
            cursor: pointer;
            color: #8effb2;
            margin-top: 10px;
            display: inline-block;
            padding: 3px 8px;
            background-color: #172e35;
            border-radius: 4px;
          }
          .entry-toggle:hover {
            background-color: #0c1a1e;
          }
          .entry-details {
            margin-top: 10px;
            padding: 10px;
            background-color: #2a4d3e;
            border-radius: 5px;
          }
          pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            max-height: 300px;
            overflow-y: auto;
            background-color: #244433;
            padding: 10px;
            border-radius: 5px;
          }
          nav {
            margin-top: 20px;
            text-align: center;
          }
          nav a {
            color: #8effb2;
            text-decoration: none;
            margin: 0 10px;
            padding: 5px 10px;
            border-radius: 4px;
            background-color: #172e35;
          }
          nav a:hover {
            background-color: #0c1a1e;
          }
          .stats {
            background-color: #2a4d3e;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
        </style>
        <script>
          function toggleDetails(element) {
            const details = element.nextElementSibling;
            const isVisible = details.style.display !== 'none';
            
            details.style.display = isVisible ? 'none' : 'block';
            element.textContent = isVisible ? 'Show Details' : 'Hide Details';
          }
        </script>
      </head>
      <body>
        <div class="container">
          <h1>IP History - Last 7 Days</h1>
          
          <div class="stats">
            <h2>Stats</h2>
            <p>Total recorded visits: ${ipHistory.length}</p>
            <p>Number of days with data: ${Object.keys(groupedByDay).length}</p>
            <p>Data retention: 7 days</p>
            <p>Server timezone: Europe/Copenhagen</p>
          </div>
          
          ${daysHtml || '<p>No history data available yet.</p>'}
          
          <nav>
            <a href="/">Back to Home</a>
            <a href="/history">Refresh History</a>
          </nav>
        </div>
      </body>
    </html>
  `);
});

// Basic error handling for routes
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Server Error</title>
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
          .error {
            margin-top: 20px;
            background-color: #2a4d3e;
            padding: 15px;
            border-radius: 5px;
            text-align: left;
          }
          nav {
            margin-top: 20px;
          }
          nav a {
            color: #8effb2;
            text-decoration: none;
            margin: 0 10px;
            padding: 5px 10px;
            border-radius: 4px;
            background-color: #172e35;
          }
          nav a:hover {
            background-color: #0c1a1e;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Server Error</h1>
          <div class="error">
            <p>Sorry, something went wrong. Please try again later.</p>
          </div>
          <nav>
            <a href="/">Back to Home</a>
          </nav>
        </div>
      </body>
    </html>
  `);
});

// Catch-all route for 404 errors
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Page Not Found</title>
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
          .error {
            margin-top: 20px;
            background-color: #2a4d3e;
            padding: 15px;
            border-radius: 5px;
          }
          nav {
            margin-top: 20px;
          }
          nav a {
            color: #8effb2;
            text-decoration: none;
            margin: 0 10px;
            padding: 5px 10px;
            border-radius: 4px;
            background-color: #172e35;
          }
          nav a:hover {
            background-color: #0c1a1e;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Page Not Found</h1>
          <div class="error">
            <p>The page you requested does not exist.</p>
            <p>Requested path: ${req.path}</p>
          </div>
          <nav>
            <a href="/">Back to Home</a>
          </nav>
        </div>
      </body>
    </html>
  `);
});

const server = app.listen(port, () => {
  console.log(`App listening at port ${port}`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
  
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Try a different port.`);
  }
  
  process.exit(1);
});
