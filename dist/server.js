const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8080;

// Determine the base directory
// When packaged with pkg, look for files next to the executable
const baseDir = process.pkg ? path.dirname(process.execPath) : process.cwd();

console.log('========================================');
console.log('Game Server Starting...');
console.log('========================================');
console.log('Base directory:', baseDir);
console.log('Is packaged:', !!process.pkg);
console.log('Looking for files in:', baseDir);
console.log('========================================\n');

// List files in base directory on startup
try {
  console.log('Files in base directory:');
  const files = fs.readdirSync(baseDir);
  files.forEach(file => {
    const filePath = path.join(baseDir, file);
    const stats = fs.statSync(filePath);
    console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${file}`);
  });
  console.log('');
} catch (err) {
  console.error('Could not list files:', err.message);
}

// MIME types for common file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'application/font-woff',
  '.woff2': 'application/font-woff2',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  console.log(`\n📥 ${req.method} ${req.url}`);

  // Parse URL and handle root
  let requestPath = req.url.split('?')[0]; // Remove query parameters
  if (requestPath === '/' || requestPath === '') {
    requestPath = '/index.html';
  }

  // Decode URL to handle spaces and special characters
  // e.g., "my%20file.js" becomes "my file.js"
  try {
    requestPath = decodeURIComponent(requestPath);
  } catch (e) {
    console.log('   ⚠️  Could not decode URL:', e.message);
  }

  // Construct full file path (remove leading slash)
  const filePath = path.join(baseDir, requestPath.substring(1));
  
  console.log(`   Resolved to: ${filePath}`);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`   ❌ File not found`);
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head><title>404 Not Found</title></head>
        <body>
          <h1>404 - File Not Found</h1>
          <p><strong>Requested:</strong> ${req.url}</p>
          <p><strong>Looking for:</strong> ${filePath}</p>
          <p><strong>Base directory:</strong> ${baseDir}</p>
          <hr>
          <p><strong>Tip:</strong> Make sure your game files (index.html, src/ folder, etc.) are in the same folder as this executable!</p>
        </body>
      </html>
    `, 'utf-8');
    return;
  }

  // Check if it's a directory
  const stats = fs.statSync(filePath);
  if (stats.isDirectory()) {
    console.log(`   📁 Directory, looking for index.html...`);
    const indexPath = path.join(filePath, 'index.html');
    if (!fs.existsSync(indexPath)) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - No index.html in directory</h1>', 'utf-8');
      return;
    }
  }

  // Get file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  console.log(`   ✅ Serving as: ${contentType}`);

  // Read and serve the file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      console.log(`   ❌ Error reading file:`, error.message);
      res.writeHead(500);
      res.end(`Server Error: ${error.code}`, 'utf-8');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
      console.log(`   ✅ Sent (${content.length} bytes)`);
    }
  });
});

server.listen(PORT, () => {
  console.log('\n========================================');
  console.log(`✅ Server running at http://localhost:${PORT}/`);
  console.log('========================================');
  console.log('Opening game in browser...\n');
  
  // Open browser automatically
  const url = `http://localhost:${PORT}`;
  const platform = process.platform;
  
  let command;
  if (platform === 'win32') {
    command = `start ${url}`;
  } else if (platform === 'darwin') {
    command = `open ${url}`;
  } else {
    command = `xdg-open ${url}`;
  }
  
  exec(command, (err) => {
    if (err) {
      console.log('Could not open browser automatically.');
      console.log('Please manually open:', url);
    }
  });
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('\n\nShutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
