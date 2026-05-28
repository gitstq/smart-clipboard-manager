/**
 * Main process entry point for Smart Clipboard Manager
 */

import { app, BrowserWindow, clipboard, globalShortcut, ipcMain, nativeTheme, shell, Tray, Menu, Notification } from 'electron';
import * as path from 'path';
import { ClipboardStore } from './clipboard-store';
import { ClipboardItem, Settings, ContentType } from '../shared/types';

// Keep global references
let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let clipboardStore: ClipboardStore;
let clipboardWatcher: NodeJS.Timeout | null = null;
let isQuitting = false;

// Get icon path based on platform
function getIconPath(): string {
  const iconName = process.platform === 'win32' ? 'icon.ico' : 'icon.png';
  return path.join(__dirname, '../../assets', iconName);
}

/**
 * Create main application window
 */
function createMainWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 700,
    minHeight: 500,
    show: false, // Don't show until ready
    frame: false, // Custom title bar
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: getIconPath(),
    titleBarStyle: 'hidden',
    vibrancy: 'sidebar', // macOS vibrancy effect
  });

  // Load renderer HTML
  window.loadFile(path.join(__dirname, '../renderer/index.html'));

  // Show window when ready
  window.once('ready-to-show', () => {
    window.show();
    
    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
      window.webContents.openDevTools();
    }
  });

  // Handle window close
  window.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      window.hide();
    }
  });

  // Handle window closed
  window.on('closed', () => {
    mainWindow = null;
  });

  return window;
}

/**
 * Create system tray
 */
function createTray(): void {
  const iconPath = getIconPath();
  tray = new Tray(iconPath);
  
  tray.setToolTip('Smart Clipboard Manager');
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '📋 Open Clipboard Manager',
      click: () => {
        showMainWindow();
      }
    },
    {
      label: '🧹 Clear History',
      click: () => {
        clipboardStore.clearHistory();
        showNotification('History Cleared', 'Clipboard history has been cleared.');
      }
    },
    { type: 'separator' },
    {
      label: '⚙️ Settings',
      click: () => {
        showMainWindow();
        // Send message to renderer to open settings
        mainWindow?.webContents.send('navigate', 'settings');
      }
    },
    { type: 'separator' },
    {
      label: '❌ Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    showMainWindow();
  });
  
  tray.on('double-click', () => {
    showMainWindow();
  });
}

/**
 * Show main window
 */
function showMainWindow(): void {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.show();
    mainWindow.focus();
  } else {
    mainWindow = createMainWindow();
  }
}

/**
 * Hide main window
 */
function hideMainWindow(): void {
  mainWindow?.hide();
}

/**
 * Show notification
 */
function showNotification(title: string, body: string): void {
  const settings = clipboardStore.getSettings();
  if (!settings.showNotifications) {
    return;
  }

  new Notification({
    title,
    body,
    icon: getIconPath()
  }).show();
}

/**
 * Start clipboard watcher
 */
function startClipboardWatcher(): void {
  let lastText = clipboard.readText();
  
  clipboardWatcher = setInterval(() => {
    const currentText = clipboard.readText();
    
    if (currentText && currentText !== lastText) {
      lastText = currentText;
      
      const item = clipboardStore.addItem(currentText);
      
      if (item) {
        // Notify renderer about new item
        mainWindow?.webContents.send('clipboard:newItem', item);
        
        // Show notification for URLs
        if (item.type === ContentType.URL) {
          showNotification('URL Copied', truncateText(currentText, 50));
        }
      }
    }
  }, 500); // Check every 500ms
}

/**
 * Stop clipboard watcher
 */
function stopClipboardWatcher(): void {
  if (clipboardWatcher) {
    clearInterval(clipboardWatcher);
    clipboardWatcher = null;
  }
}

/**
 * Register global shortcuts
 */
function registerGlobalShortcuts(): void {
  const settings = clipboardStore.getSettings();
  
  // Register show/hide shortcut
  const ret = globalShortcut.register(settings.globalHotkey, () => {
    if (mainWindow?.isVisible()) {
      hideMainWindow();
    } else {
      showMainWindow();
    }
  });
  
  if (!ret) {
    console.error('[Main] Failed to register global shortcut');
  }
}

/**
 * Unregister global shortcuts
 */
function unregisterGlobalShortcuts(): void {
  globalShortcut.unregisterAll();
}

/**
 * Truncate text helper
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Setup IPC handlers
 */
function setupIpcHandlers(): void {
  // Clipboard handlers
  ipcMain.handle('clipboard:getHistory', () => {
    return clipboardStore.getAllItems();
  });
  
  ipcMain.handle('clipboard:search', (_, query: string, filters?: { type?: ContentType; favorite?: boolean }) => {
    return clipboardStore.search(query, filters);
  });
  
  ipcMain.handle('clipboard:deleteItem', (_, id: string) => {
    return clipboardStore.deleteItem(id);
  });
  
  ipcMain.handle('clipboard:clearHistory', () => {
    return clipboardStore.clearHistory();
  });
  
  ipcMain.handle('clipboard:toggleFavorite', (_, id: string) => {
    return clipboardStore.toggleFavorite(id);
  });
  
  ipcMain.handle('clipboard:copyItem', (_, id: string) => {
    const item = clipboardStore.getItem(id);
    if (item) {
      clipboard.writeText(item.content);
      return true;
    }
    return false;
  });
  
  // Settings handlers
  ipcMain.handle('settings:get', () => {
    return clipboardStore.getSettings();
  });
  
  ipcMain.handle('settings:update', (_, settings: Partial<Settings>) => {
    const newSettings = clipboardStore.updateSettings(settings);
    
    // Re-register shortcuts if hotkey changed
    if (settings.globalHotkey) {
      unregisterGlobalShortcuts();
      registerGlobalShortcuts();
    }
    
    return newSettings;
  });
  
  // Stats handlers
  ipcMain.handle('stats:get', () => {
    return clipboardStore.getStats();
  });
  
  // App handlers
  ipcMain.handle('app:show', () => {
    showMainWindow();
  });
  
  ipcMain.handle('app:hide', () => {
    hideMainWindow();
  });
  
  ipcMain.handle('app:quit', () => {
    isQuitting = true;
    app.quit();
  });
  
  // Open external link
  ipcMain.handle('shell:openExternal', (_, url: string) => {
    shell.openExternal(url);
  });
}

/**
 * App event handlers
 */
app.whenReady().then(() => {
  console.log('[Main] App is ready');
  
  // Initialize store
  clipboardStore = new ClipboardStore();
  
  // Create window
  mainWindow = createMainWindow();
  
  // Create tray
  createTray();
  
  // Setup IPC
  setupIpcHandlers();
  
  // Register shortcuts
  registerGlobalShortcuts();
  
  // Start watching clipboard
  startClipboardWatcher();
  
  // Setup auto-cleanup (daily)
  setInterval(() => {
    clipboardStore.cleanup();
  }, 24 * 60 * 60 * 1000);
  
  // macOS: activate handler
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
    } else {
      showMainWindow();
    }
  });
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    showMainWindow();
  });
}

// Before quit
app.on('before-quit', () => {
  isQuitting = true;
});

// All windows closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Will quit
app.on('will-quit', () => {
  unregisterGlobalShortcuts();
  stopClipboardWatcher();
});

// Security: prevent new window creation
app.on('web-contents-created', (_, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});
