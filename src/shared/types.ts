/**
 * Shared types for Smart Clipboard Manager
 */

export interface ClipboardItem {
  id: string;
  content: string;
  type: ContentType;
  timestamp: number;
  favorite: boolean;
  tags: string[];
  source?: string;
}

export enum ContentType {
  TEXT = 'text',
  URL = 'url',
  EMAIL = 'email',
  CODE = 'code',
  FILE_PATH = 'file_path',
  COLOR = 'color',
  NUMBER = 'number',
  UNKNOWN = 'unknown'
}

export interface SearchFilters {
  type?: ContentType;
  favorite?: boolean;
  dateFrom?: number;
  dateTo?: number;
  tags?: string[];
}

export interface Settings {
  maxHistoryItems: number;
  autoCleanupDays: number;
  globalHotkey: string;
  startupAtLogin: boolean;
  showNotifications: boolean;
  excludeApps: string[];
  theme: 'light' | 'dark' | 'system';
  language: 'zh-CN' | 'zh-TW' | 'en';
}

export const DEFAULT_SETTINGS: Settings = {
  maxHistoryItems: 1000,
  autoCleanupDays: 30,
  globalHotkey: 'CommandOrControl+Shift+V',
  startupAtLogin: true,
  showNotifications: true,
  excludeApps: [],
  theme: 'system',
  language: 'zh-CN'
};

export interface Stats {
  totalItems: number;
  favoriteItems: number;
  itemsByType: Record<ContentType, number>;
  lastCleanup: number;
}

export type IpcChannels = {
  'clipboard:getHistory': () => ClipboardItem[];
  'clipboard:search': (query: string, filters?: SearchFilters) => ClipboardItem[];
  'clipboard:deleteItem': (id: string) => boolean;
  'clipboard:clearHistory': () => boolean;
  'clipboard:toggleFavorite': (id: string) => boolean;
  'clipboard:copyItem': (id: string) => boolean;
  'settings:get': () => Settings;
  'settings:update': (settings: Partial<Settings>) => Settings;
  'stats:get': () => Stats;
  'app:show': () => void;
  'app:hide': () => void;
  'app:quit': () => void;
};
