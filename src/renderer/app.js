/**
 * Smart Clipboard Manager - Renderer Process
 */

// State
let allItems = [];
let currentFilter = 'all';
let currentTypeFilter = null;
let settings = null;

// DOM Elements
const elements = {
  clipboardList: document.getElementById('clipboard-list'),
  emptyState: document.getElementById('empty-state'),
  searchInput: document.getElementById('search-input'),
  resultCount: document.getElementById('result-count'),
  navItems: document.querySelectorAll('.nav-item'),
  countAll: document.getElementById('count-all'),
  countFavorites: document.getElementById('count-favorites'),
  
  // Buttons
  btnMinimize: document.getElementById('btn-minimize'),
  btnClose: document.getElementById('btn-close'),
  btnClear: document.getElementById('btn-clear'),
  btnSettings: document.getElementById('btn-settings'),
  btnStats: document.getElementById('btn-stats'),
  
  // Settings Modal
  settingsModal: document.getElementById('settings-modal'),
  btnCloseSettings: document.getElementById('btn-close-settings'),
  btnCancelSettings: document.getElementById('btn-cancel-settings'),
  btnSaveSettings: document.getElementById('btn-save-settings'),
  settingMaxItems: document.getElementById('setting-max-items'),
  settingAutoCleanup: document.getElementById('setting-auto-cleanup'),
  settingHotkey: document.getElementById('setting-hotkey'),
  settingTheme: document.getElementById('setting-theme'),
  settingLanguage: document.getElementById('setting-language'),
  settingNotifications: document.getElementById('setting-notifications'),
  settingStartup: document.getElementById('setting-startup'),
  
  // Stats Modal
  statsModal: document.getElementById('stats-modal'),
  btnCloseStats: document.getElementById('btn-close-stats'),
  statTotal: document.getElementById('stat-total'),
  statFavorites: document.getElementById('stat-favorites'),
  typeChart: document.getElementById('type-chart')
};

// Translations
const translations = {
  'zh-CN': {
    'app.title': '智能剪贴板管理器',
    'search.placeholder': '搜索剪贴板历史...',
    'nav.all': '全部项目',
    'nav.favorites': '收藏夹',
    'nav.types': '类型筛选',
    'type.text': '文本',
    'type.url': '链接',
    'type.email': '邮箱',
    'type.code': '代码',
    'type.color': '颜色',
    'history.title': '剪贴板历史',
    'action.clear': '清空历史',
    'action.cancel': '取消',
    'action.save': '保存',
    'settings.title': '设置',
    'settings.general': '常规设置',
    'settings.maxItems': '最大历史记录数',
    'settings.autoCleanup': '自动清理天数',
    'settings.hotkey': '全局快捷键',
    'settings.appearance': '外观',
    'settings.theme': '主题',
    'settings.language': '语言',
    'settings.notifications': '通知',
    'settings.showNotifications': '显示复制通知',
    'settings.startup': '开机启动',
    'theme.system': '跟随系统',
    'theme.light': '浅色',
    'theme.dark': '深色',
    'stats.title': '使用统计',
    'stats.totalItems': '总记录数',
    'stats.favorites': '收藏数',
    'stats.byType': '按类型分布',
    'empty.title': '暂无剪贴板记录',
    'empty.description': '复制一些内容，它将自动显示在这里',
    'toast.copied': '已复制到剪贴板',
    'toast.deleted': '已删除',
    'toast.favoriteAdded': '已添加到收藏',
    'toast.favoriteRemoved': '已取消收藏',
    'toast.cleared': '历史记录已清空'
  },
  'zh-TW': {
    'app.title': '智慧剪貼簿管理器',
    'search.placeholder': '搜尋剪貼簿歷史...',
    'nav.all': '全部項目',
    'nav.favorites': '收藏夾',
    'nav.types': '類型篩選',
    'type.text': '文字',
    'type.url': '連結',
    'type.email': '郵件',
    'type.code': '程式碼',
    'type.color': '顏色',
    'history.title': '剪貼簿歷史',
    'action.clear': '清空歷史',
    'action.cancel': '取消',
    'action.save': '儲存',
    'settings.title': '設定',
    'settings.general': '一般設定',
    'settings.maxItems': '最大歷史記錄數',
    'settings.autoCleanup': '自動清理天數',
    'settings.hotkey': '全域快捷鍵',
    'settings.appearance': '外觀',
    'settings.theme': '主題',
    'settings.language': '語言',
    'settings.notifications': '通知',
    'settings.showNotifications': '顯示複製通知',
    'settings.startup': '開機啟動',
    'theme.system': '跟隨系統',
    'theme.light': '淺色',
    'theme.dark': '深色',
    'stats.title': '使用統計',
    'stats.totalItems': '總記錄數',
    'stats.favorites': '收藏數',
    'stats.byType': '按類型分布',
    'empty.title': '暫無剪貼簿記錄',
    'empty.description': '複製一些內容，它將自動顯示在這裡',
    'toast.copied': '已複製到剪貼簿',
    'toast.deleted': '已刪除',
    'toast.favoriteAdded': '已新增到收藏',
    'toast.favoriteRemoved': '已取消收藏',
    'toast.cleared': '歷史記錄已清空'
  },
  'en': {
    'app.title': 'Smart Clipboard Manager',
    'search.placeholder': 'Search clipboard history...',
    'nav.all': 'All Items',
    'nav.favorites': 'Favorites',
    'nav.types': 'Filter by Type',
    'type.text': 'Text',
    'type.url': 'URL',
    'type.email': 'Email',
    'type.code': 'Code',
    'type.color': 'Color',
    'history.title': 'Clipboard History',
    'action.clear': 'Clear History',
    'action.cancel': 'Cancel',
    'action.save': 'Save',
    'settings.title': 'Settings',
    'settings.general': 'General',
    'settings.maxItems': 'Max History Items',
    'settings.autoCleanup': 'Auto Cleanup Days',
    'settings.hotkey': 'Global Hotkey',
    'settings.appearance': 'Appearance',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    'settings.showNotifications': 'Show Copy Notifications',
    'settings.startup': 'Start at Login',
    'theme.system': 'System',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'stats.title': 'Statistics',
    'stats.totalItems': 'Total Items',
    'stats.favorites': 'Favorites',
    'stats.byType': 'Distribution by Type',
    'empty.title': 'No Clipboard History',
    'empty.description': 'Copy something and it will appear here automatically',
    'toast.copied': 'Copied to clipboard',
    'toast.deleted': 'Deleted',
    'toast.favoriteAdded': 'Added to favorites',
    'toast.favoriteRemoved': 'Removed from favorites',
    'toast.cleared': 'History cleared'
  }
};

// Type icons and labels
const typeConfig = {
  text: { icon: '📝', label: 'type.text' },
  url: { icon: '🔗', label: 'type.url' },
  email: { icon: '📧', label: 'type.email' },
  code: { icon: '💻', label: 'type.code' },
  file_path: { icon: '📁', label: 'type.file' },
  color: { icon: '🎨', label: 'type.color' },
  number: { icon: '🔢', label: 'type.number' },
  unknown: { icon: '📄', label: 'type.unknown' }
};

// Initialize
async function init() {
  await loadSettings();
  await loadHistory();
  setupEventListeners();
  setupIpcListeners();
  applyTranslations();
}

// Load settings
async function loadSettings() {
  try {
    settings = await window.electronAPI.getSettings();
    updateSettingsUI();
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
}

// Load history
async function loadHistory() {
  try {
    allItems = await window.electronAPI.getHistory();
    updateCounts();
    renderItems();
  } catch (error) {
    console.error('Failed to load history:', error);
  }
}

// Update counts
function updateCounts() {
  elements.countAll.textContent = allItems.length;
  elements.countFavorites.textContent = allItems.filter(item => item.favorite).length;
}

// Render items
function renderItems(items = allItems) {
  const filteredItems = filterItems(items);
  
  if (filteredItems.length === 0) {
    elements.clipboardList.style.display = 'none';
    elements.emptyState.style.display = 'flex';
    elements.resultCount.textContent = '';
    return;
  }
  
  elements.clipboardList.style.display = 'block';
  elements.emptyState.style.display = 'none';
  elements.resultCount.textContent = `${filteredItems.length} items`;
  
  elements.clipboardList.innerHTML = filteredItems.map(item => createItemHTML(item)).join('');
  
  // Add event listeners to item buttons
  filteredItems.forEach(item => {
    const el = document.querySelector(`[data-id="${item.id}"]`);
    if (el) {
      el.querySelector('.action-copy')?.addEventListener('click', (e) => {
        e.stopPropagation();
        copyItem(item.id);
      });
      el.querySelector('.action-favorite')?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(item.id);
      });
      el.querySelector('.action-delete')?.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteItem(item.id);
      });
      el.addEventListener('click', () => copyItem(item.id));
    }
  });
}

// Filter items
function filterItems(items) {
  let filtered = items;
  
  // Apply nav filter
  if (currentFilter === 'favorite') {
    filtered = filtered.filter(item => item.favorite);
  } else if (currentFilter === 'type' && currentTypeFilter) {
    filtered = filtered.filter(item => item.type === currentTypeFilter);
  }
  
  // Apply search filter
  const searchQuery = elements.searchInput.value.trim().toLowerCase();
  if (searchQuery) {
    filtered = filtered.filter(item => 
      item.content.toLowerCase().includes(searchQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery))
    );
  }
  
  return filtered;
}

// Create item HTML
function createItemHTML(item) {
  const typeInfo = typeConfig[item.type] || typeConfig.unknown;
  const timeAgo = formatTimeAgo(item.timestamp);
  const content = escapeHtml(truncateText(item.content, 200));
  
  return `
    <div class="clipboard-item" data-id="${item.id}">
      <div class="item-icon">${typeInfo.icon}</div>
      <div class="item-content">
        <div class="item-text">${content}</div>
        <div class="item-meta">
          <span class="item-type">${typeInfo.icon} ${t(typeInfo.label)}</span>
          <span>${timeAgo}</span>
          ${item.tags.length > 0 ? `<span>• ${item.tags.slice(0, 3).join(', ')}</span>` : ''}
        </div>
      </div>
      <div class="item-actions">
        <button class="action-btn action-copy" title="${t('toast.copied')}">📋</button>
        <button class="action-btn action-favorite ${item.favorite ? 'favorite' : ''}" title="Favorite">
          ${item.favorite ? '⭐' : '☆'}
        </button>
        <button class="action-btn action-delete" title="${t('toast.deleted')}">🗑️</button>
      </div>
    </div>
  `;
}

// Setup event listeners
function setupEventListeners() {
  // Window controls
  elements.btnMinimize?.addEventListener('click', () => {
    window.electronAPI.hideApp();
  });
  
  elements.btnClose?.addEventListener('click', () => {
    window.electronAPI.hideApp();
  });
  
  // Search
  elements.searchInput?.addEventListener('input', () => {
    renderItems();
  });
  
  // Navigation
  elements.navItems.forEach(nav => {
    nav.addEventListener('click', () => {
      elements.navItems.forEach(n => n.classList.remove('active'));
      nav.classList.add('active');
      
      currentFilter = nav.dataset.filter || 'all';
      currentTypeFilter = nav.dataset.type || null;
      
      renderItems();
    });
  });
  
  // Clear history
  elements.btnClear?.addEventListener('click', async () => {
    if (confirm(t('action.clear') + '?')) {
      await window.electronAPI.clearHistory();
      await loadHistory();
      showToast(t('toast.cleared'));
    }
  });
  
  // Settings modal
  elements.btnSettings?.addEventListener('click', () => {
    elements.settingsModal.style.display = 'flex';
  });
  
  elements.btnCloseSettings?.addEventListener('click', closeSettings);
  elements.btnCancelSettings?.addEventListener('click', closeSettings);
  elements.btnSaveSettings?.addEventListener('click', saveSettings);
  
  elements.settingsModal?.querySelector('.modal-overlay')?.addEventListener('click', closeSettings);
  
  // Stats modal
  elements.btnStats?.addEventListener('click', async () => {
    await loadStats();
    elements.statsModal.style.display = 'flex';
  });
  
  elements.btnCloseStats?.addEventListener('click', () => {
    elements.statsModal.style.display = 'none';
  });
  
  elements.statsModal?.querySelector('.modal-overlay')?.addEventListener('click', () => {
    elements.statsModal.style.display = 'none';
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSettings();
      elements.statsModal.style.display = 'none';
    }
  });
}

// Setup IPC listeners
function setupIpcListeners() {
  // Listen for new items
  window.electronAPI.onNewItem((item) => {
    allItems.unshift(item);
    updateCounts();
    renderItems();
  });
  
  // Listen for navigation
  window.electronAPI.onNavigate((page) => {
    if (page === 'settings') {
      elements.settingsModal.style.display = 'flex';
    }
  });
}

// Copy item
async function copyItem(id) {
  try {
    await window.electronAPI.copyItem(id);
    showToast(t('toast.copied'));
  } catch (error) {
    console.error('Failed to copy item:', error);
  }
}

// Toggle favorite
async function toggleFavorite(id) {
  try {
    await window.electronAPI.toggleFavorite(id);
    
    // Update local state
    const item = allItems.find(i => i.id === id);
    if (item) {
      item.favorite = !item.favorite;
    }
    
    updateCounts();
    renderItems();
    
    showToast(item.favorite ? t('toast.favoriteAdded') : t('toast.favoriteRemoved'));
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
  }
}

// Delete item
async function deleteItem(id) {
  try {
    await window.electronAPI.deleteItem(id);
    allItems = allItems.filter(item => item.id !== id);
    updateCounts();
    renderItems();
    showToast(t('toast.deleted'));
  } catch (error) {
    console.error('Failed to delete item:', error);
  }
}

// Load stats
async function loadStats() {
  try {
    const stats = await window.electronAPI.getStats();
    elements.statTotal.textContent = stats.totalItems;
    elements.statFavorites.textContent = stats.favoriteItems;
    
    // Render type chart
    const typeData = Object.entries(stats.itemsByType)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1]);
    
    const maxCount = Math.max(...typeData.map(([_, count]) => count));
    
    elements.typeChart.innerHTML = typeData.map(([type, count]) => {
      const typeInfo = typeConfig[type] || typeConfig.unknown;
      const percentage = (count / maxCount) * 100;
      return `
        <div class="chart-item">
          <div class="chart-label">${typeInfo.icon} ${t(typeInfo.label)}</div>
          <div class="chart-bar">
            <div class="chart-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="chart-value">${count}</div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

// Settings functions
function updateSettingsUI() {
  if (!settings) return;
  
  elements.settingMaxItems.value = settings.maxHistoryItems;
  elements.settingAutoCleanup.value = settings.autoCleanupDays;
  elements.settingHotkey.value = settings.globalHotkey;
  elements.settingTheme.value = settings.theme;
  elements.settingLanguage.value = settings.language;
  elements.settingNotifications.checked = settings.showNotifications;
  elements.settingStartup.checked = settings.startupAtLogin;
}

function closeSettings() {
  elements.settingsModal.style.display = 'none';
  updateSettingsUI(); // Reset to saved values
}

async function saveSettings() {
  const newSettings = {
    maxHistoryItems: parseInt(elements.settingMaxItems.value),
    autoCleanupDays: parseInt(elements.settingAutoCleanup.value),
    theme: elements.settingTheme.value,
    language: elements.settingLanguage.value,
    showNotifications: elements.settingNotifications.checked,
    startupAtLogin: elements.settingStartup.checked
  };
  
  try {
    settings = await window.electronAPI.updateSettings(newSettings);
    applyTranslations();
    closeSettings();
    showToast(t('action.save'));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

// Translation functions
function t(key) {
  const lang = settings?.language || 'zh-CN';
  return translations[lang]?.[key] || translations['en'][key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    el.placeholder = t(key);
  });
}

// Utility functions
function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return t('time.justNow') || 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return new Date(timestamp).toLocaleDateString();
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message) {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  // Create new toast
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Remove after 2 seconds
  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// Start
init();
