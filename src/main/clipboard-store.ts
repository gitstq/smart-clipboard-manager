/**
 * Clipboard data store management
 */

import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import { ClipboardItem, Settings, Stats, DEFAULT_SETTINGS, ContentType } from '../shared/types';
import { generateId, detectContentType, extractTags, isSensitiveContent } from '../shared/utils';

export class ClipboardStore {
  private dataPath: string;
  private items: Map<string, ClipboardItem> = new Map();
  private settings: Settings = { ...DEFAULT_SETTINGS };
  private stats: Stats = {
    totalItems: 0,
    favoriteItems: 0,
    itemsByType: {
      [ContentType.TEXT]: 0,
      [ContentType.URL]: 0,
      [ContentType.EMAIL]: 0,
      [ContentType.CODE]: 0,
      [ContentType.FILE_PATH]: 0,
      [ContentType.COLOR]: 0,
      [ContentType.NUMBER]: 0,
      [ContentType.UNKNOWN]: 0
    },
    lastCleanup: Date.now()
  };
  private lastContent: string = '';

  constructor() {
    const userDataPath = app.getPath('userData');
    this.dataPath = path.join(userDataPath, 'clipboard-data.json');
    this.loadData();
  }

  /**
   * Load data from disk
   */
  private loadData(): void {
    try {
      if (fs.existsSync(this.dataPath)) {
        const data = JSON.parse(fs.readFileSync(this.dataPath, 'utf-8'));
        
        // Load items
        if (data.items) {
          this.items = new Map(Object.entries(data.items));
        }
        
        // Load settings
        if (data.settings) {
          this.settings = { ...DEFAULT_SETTINGS, ...data.settings };
        }
        
        // Load stats
        if (data.stats) {
          this.stats = data.stats;
        }

        console.log(`[ClipboardStore] Loaded ${this.items.size} items from disk`);
      }
    } catch (error) {
      console.error('[ClipboardStore] Error loading data:', error);
    }
  }

  /**
   * Save data to disk
   */
  private saveData(): void {
    try {
      const data = {
        items: Object.fromEntries(this.items),
        settings: this.settings,
        stats: this.stats
      };
      
      // Ensure directory exists
      const dir = path.dirname(this.dataPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('[ClipboardStore] Error saving data:', error);
    }
  }

  /**
   * Add new clipboard item
   */
  addItem(content: string, source?: string): ClipboardItem | null {
    // Skip empty content
    if (!content || content.trim().length === 0) {
      return null;
    }

    // Skip if same as last content (duplicate)
    if (content === this.lastContent) {
      return null;
    }

    // Skip sensitive content
    if (isSensitiveContent(content)) {
      console.log('[ClipboardStore] Skipping sensitive content');
      return null;
    }

    // Check for existing identical content
    for (const item of this.items.values()) {
      if (item.content === content) {
        // Update timestamp to bring to top
        item.timestamp = Date.now();
        this.saveData();
        this.lastContent = content;
        return item;
      }
    }

    // Create new item
    const item: ClipboardItem = {
      id: generateId(),
      content: content,
      type: detectContentType(content),
      timestamp: Date.now(),
      favorite: false,
      tags: extractTags(content),
      source: source
    };

    // Add to store
    this.items.set(item.id, item);
    this.lastContent = content;

    // Update stats
    this.stats.totalItems++;
    this.stats.itemsByType[item.type]++;

    // Enforce max history limit
    this.enforceMaxHistory();

    // Save to disk
    this.saveData();

    console.log(`[ClipboardStore] Added new item: ${item.id} (${item.type})`);
    return item;
  }

  /**
   * Get all items sorted by timestamp (newest first)
   */
  getAllItems(): ClipboardItem[] {
    return Array.from(this.items.values())
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get item by ID
   */
  getItem(id: string): ClipboardItem | undefined {
    return this.items.get(id);
  }

  /**
   * Delete item by ID
   */
  deleteItem(id: string): boolean {
    const item = this.items.get(id);
    if (!item) {
      return false;
    }

    this.items.delete(id);
    
    // Update stats
    this.stats.totalItems--;
    this.stats.itemsByType[item.type]--;
    if (item.favorite) {
      this.stats.favoriteItems--;
    }

    this.saveData();
    return true;
  }

  /**
   * Toggle favorite status
   */
  toggleFavorite(id: string): boolean {
    const item = this.items.get(id);
    if (!item) {
      return false;
    }

    item.favorite = !item.favorite;
    
    // Update stats
    if (item.favorite) {
      this.stats.favoriteItems++;
    } else {
      this.stats.favoriteItems--;
    }

    this.saveData();
    return true;
  }

  /**
   * Search items
   */
  search(query: string, filters?: { type?: ContentType; favorite?: boolean }): ClipboardItem[] {
    let results = this.getAllItems();

    // Apply text search
    if (query && query.trim().length > 0) {
      const lowerQuery = query.toLowerCase().trim();
      results = results.filter(item => 
        item.content.toLowerCase().includes(lowerQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    // Apply type filter
    if (filters?.type) {
      results = results.filter(item => item.type === filters.type);
    }

    // Apply favorite filter
    if (filters?.favorite !== undefined) {
      results = results.filter(item => item.favorite === filters.favorite);
    }

    return results;
  }

  /**
   * Clear all history
   */
  clearHistory(): boolean {
    // Keep favorites if user wants
    const favorites = Array.from(this.items.values()).filter(item => item.favorite);
    
    this.items.clear();
    
    // Restore favorites
    favorites.forEach(item => this.items.set(item.id, item));

    // Reset stats
    this.stats.totalItems = favorites.length;
    this.stats.favoriteItems = favorites.length;
    this.stats.itemsByType = {
      [ContentType.TEXT]: 0,
      [ContentType.URL]: 0,
      [ContentType.EMAIL]: 0,
      [ContentType.CODE]: 0,
      [ContentType.FILE_PATH]: 0,
      [ContentType.COLOR]: 0,
      [ContentType.NUMBER]: 0,
      [ContentType.UNKNOWN]: 0
    };
    
    // Recalculate type stats
    favorites.forEach(item => {
      this.stats.itemsByType[item.type]++;
    });

    this.saveData();
    return true;
  }

  /**
   * Get settings
   */
  getSettings(): Settings {
    return { ...this.settings };
  }

  /**
   * Update settings
   */
  updateSettings(newSettings: Partial<Settings>): Settings {
    this.settings = { ...this.settings, ...newSettings };
    this.saveData();
    return this.settings;
  }

  /**
   * Get stats
   */
  getStats(): Stats {
    return { ...this.stats };
  }

  /**
   * Enforce maximum history items limit
   */
  private enforceMaxHistory(): void {
    const maxItems = this.settings.maxHistoryItems;
    if (this.items.size <= maxItems) {
      return;
    }

    // Get non-favorite items sorted by timestamp
    const nonFavorites = Array.from(this.items.values())
      .filter(item => !item.favorite)
      .sort((a, b) => a.timestamp - b.timestamp);

    // Remove oldest items until under limit
    const toRemove = this.items.size - maxItems;
    for (let i = 0; i < toRemove && i < nonFavorites.length; i++) {
      this.deleteItem(nonFavorites[i].id);
    }
  }

  /**
   * Cleanup old items
   */
  cleanup(): void {
    const cutoffTime = Date.now() - (this.settings.autoCleanupDays * 24 * 60 * 60 * 1000);
    
    const toDelete: string[] = [];
    for (const item of this.items.values()) {
      if (!item.favorite && item.timestamp < cutoffTime) {
        toDelete.push(item.id);
      }
    }

    toDelete.forEach(id => this.deleteItem(id));
    
    this.stats.lastCleanup = Date.now();
    this.saveData();

    console.log(`[ClipboardStore] Cleaned up ${toDelete.length} old items`);
  }
}
