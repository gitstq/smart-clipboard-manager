/**
 * Preload script for Smart Clipboard Manager
 * Exposes safe APIs to renderer process
 */

import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ClipboardItem, Settings, Stats, ContentType } from '../shared/types';

// API definition
export interface ElectronAPI {
  // Clipboard
  getHistory: () => Promise<ClipboardItem[]>;
  search: (query: string, filters?: { type?: ContentType; favorite?: boolean }) => Promise<ClipboardItem[]>;
  deleteItem: (id: string) => Promise<boolean>;
  clearHistory: () => Promise<boolean>;
  toggleFavorite: (id: string) => Promise<boolean>;
  copyItem: (id: string) => Promise<boolean>;
  
  // Settings
  getSettings: () => Promise<Settings>;
  updateSettings: (settings: Partial<Settings>) => Promise<Settings>;
  
  // Stats
  getStats: () => Promise<Stats>;
  
  // App
  showApp: () => Promise<void>;
  hideApp: () => Promise<void>;
  quitApp: () => Promise<void>;
  
  // Shell
  openExternal: (url: string) => Promise<void>;
  
  // Events
  onNewItem: (callback: (item: ClipboardItem) => void) => () => void;
  onNavigate: (callback: (page: string) => void) => () => void;
}

const api: ElectronAPI = {
  // Clipboard
  getHistory: () => ipcRenderer.invoke('clipboard:getHistory'),
  search: (query: string, filters?: { type?: ContentType; favorite?: boolean }) => 
    ipcRenderer.invoke('clipboard:search', query, filters),
  deleteItem: (id: string) => ipcRenderer.invoke('clipboard:deleteItem', id),
  clearHistory: () => ipcRenderer.invoke('clipboard:clearHistory'),
  toggleFavorite: (id: string) => ipcRenderer.invoke('clipboard:toggleFavorite', id),
  copyItem: (id: string) => ipcRenderer.invoke('clipboard:copyItem', id),
  
  // Settings
  getSettings: () => ipcRenderer.invoke('settings:get'),
  updateSettings: (settings: Partial<Settings>) => ipcRenderer.invoke('settings:update', settings),
  
  // Stats
  getStats: () => ipcRenderer.invoke('stats:get'),
  
  // App
  showApp: () => ipcRenderer.invoke('app:show'),
  hideApp: () => ipcRenderer.invoke('app:hide'),
  quitApp: () => ipcRenderer.invoke('app:quit'),
  
  // Shell
  openExternal: (url: string) => ipcRenderer.invoke('shell:openExternal', url),
  
  // Events
  onNewItem: (callback: (item: ClipboardItem) => void) => {
    const handler = (_: IpcRendererEvent, item: ClipboardItem) => callback(item);
    ipcRenderer.on('clipboard:newItem', handler);
    return () => {
      ipcRenderer.removeListener('clipboard:newItem', handler);
    };
  },
  onNavigate: (callback: (page: string) => void) => {
    const handler = (_: IpcRendererEvent, page: string) => callback(page);
    ipcRenderer.on('navigate', handler);
    return () => {
      ipcRenderer.removeListener('navigate', handler);
    };
  }
};

// Expose API to renderer
contextBridge.exposeInMainWorld('electronAPI', api);

// Type declaration for renderer
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
