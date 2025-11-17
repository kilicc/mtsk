import { app, BrowserWindow } from 'electron';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;
let apiProcess: ChildProcess | null = null;

function startBackendAPI() {
  // Start API server
  const apiPath = path.join(__dirname, '../../api/dist/index.js');
  
  // Check if file exists, if not use tsx for development
  const fs = require('fs');
  const useTsx = !fs.existsSync(apiPath);
  
  if (useTsx) {
    // Development: Use tsx to run TypeScript directly
    apiProcess = spawn('pnpm', ['--filter', '@mtsk/api', 'dev'], {
      cwd: path.join(__dirname, '../..'),
      shell: true,
      stdio: 'pipe',
    });
  } else {
    // Production: Run compiled JS
    apiProcess = spawn('node', [apiPath], {
      cwd: path.join(__dirname, '../../api'),
      env: { ...process.env, PORT: '3001' },
    });
  }

  apiProcess.stdout?.on('data', (data) => {
    console.log(`[API] ${data}`);
  });

  apiProcess.stderr?.on('data', (data) => {
    console.error(`[API Error] ${data}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    title: 'MTSK - Motorlu Taşıtlar Sürücü Kursu',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Development: Load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    // Wait a bit for dev server to start
    setTimeout(() => {
      mainWindow?.loadURL('http://localhost:3000');
      mainWindow?.webContents.openDevTools();
    }, 2000);
  } else {
    // Production: Load from built files
    mainWindow.loadFile(path.join(__dirname, '../../ui/dist/index.html'));
  }
}

app.whenReady().then(() => {
  // Start backend API
  startBackendAPI();

  // Create window
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Kill API process
  if (apiProcess) {
    apiProcess.kill();
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Cleanup processes
  if (apiProcess) {
    apiProcess.kill();
  }
});

