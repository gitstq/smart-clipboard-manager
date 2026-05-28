/**
 * Shared utilities for Smart Clipboard Manager
 */

import { ContentType } from './types';

/**
 * Detect content type from text
 */
export function detectContentType(text: string): ContentType {
  if (!text || text.trim().length === 0) {
    return ContentType.UNKNOWN;
  }

  const trimmed = text.trim();

  // URL detection
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
  if (urlPattern.test(trimmed)) {
    return ContentType.URL;
  }

  // Email detection
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailPattern.test(trimmed)) {
    return ContentType.EMAIL;
  }

  // Color detection (hex, rgb, hsl)
  const hexColorPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const rgbPattern = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i;
  const hslPattern = /^hsl\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*\)$/i;
  if (hexColorPattern.test(trimmed) || rgbPattern.test(trimmed) || hslPattern.test(trimmed)) {
    return ContentType.COLOR;
  }

  // File path detection
  const filePathPattern = /^(\/|[A-Za-z]:\\|~\/|\.\/|\.\.\/)/;
  if (filePathPattern.test(trimmed)) {
    return ContentType.FILE_PATH;
  }

  // Code detection (contains common code patterns)
  const codePatterns = [
    /^(function|const|let|var|class|import|export|if|for|while|return)\s/m,
    /[{};]\s*$/m,
    /^(def|class|import|from|if|for|while|return)\s/m,
    /```[\s\S]*```/,
    /`[^`]*`/,
    /\(\s*\)\s*=>/,
    /;\s*$/m
  ];
  if (codePatterns.some(pattern => pattern.test(trimmed))) {
    return ContentType.CODE;
  }

  // Number detection
  const numberPattern = /^-?\d+(\.\d+)?$/;
  if (numberPattern.test(trimmed)) {
    return ContentType.NUMBER;
  }

  return ContentType.TEXT;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format timestamp to readable string
 */
export function formatTimestamp(timestamp: number, locale: string = 'zh-CN'): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // Less than 1 minute
  if (diff < 60000) {
    return locale === 'en' ? 'Just now' : '刚刚';
  }

  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return locale === 'en' 
      ? `${minutes} minute${minutes > 1 ? 's' : ''} ago`
      : `${minutes} 分钟前`;
  }

  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return locale === 'en'
      ? `${hours} hour${hours > 1 ? 's' : ''} ago`
      : `${hours} 小时前`;
  }

  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return locale === 'en'
      ? `${days} day${days > 1 ? 's' : ''} ago`
      : `${days} 天前`;
  }

  // Format as date
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Extract tags from text
 */
export function extractTags(text: string): string[] {
  const tags: string[] = [];
  
  // Extract hashtags
  const hashtagPattern = /#(\w+)/g;
  let match;
  while ((match = hashtagPattern.exec(text)) !== null) {
    tags.push(match[1].toLowerCase());
  }

  // Extract domain from URL
  const urlPattern = /https?:\/\/([^\/]+)/;
  const urlMatch = text.match(urlPattern);
  if (urlMatch) {
    const domain = urlMatch[1].replace(/^www\./, '');
    tags.push(domain);
  }

  return [...new Set(tags)];
}

/**
 * Check if content might be sensitive (password, token, etc.)
 */
export function isSensitiveContent(text: string): boolean {
  const sensitivePatterns = [
    /password\s*[:=]\s*\S+/i,
    /passwd\s*[:=]\s*\S+/i,
    /pwd\s*[:=]\s*\S+/i,
    /token\s*[:=]\s*\S+/i,
    /api[_-]?key\s*[:=]\s*\S+/i,
    /secret\s*[:=]\s*\S+/i,
    /private[_-]?key/i,
    /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/,
    /sk-[a-zA-Z0-9]{20,}/,  // OpenAI API key pattern
    /ghp_[a-zA-Z0-9]{36}/,   // GitHub personal access token
  ];

  return sensitivePatterns.some(pattern => pattern.test(text));
}

/**
 * Get icon for content type
 */
export function getContentTypeIcon(type: ContentType): string {
  const icons: Record<ContentType, string> = {
    [ContentType.TEXT]: '📝',
    [ContentType.URL]: '🔗',
    [ContentType.EMAIL]: '📧',
    [ContentType.CODE]: '💻',
    [ContentType.FILE_PATH]: '📁',
    [ContentType.COLOR]: '🎨',
    [ContentType.NUMBER]: '🔢',
    [ContentType.UNKNOWN]: '📄'
  };
  return icons[type] || icons[ContentType.UNKNOWN];
}

/**
 * Get label for content type
 */
export function getContentTypeLabel(type: ContentType, locale: string = 'zh-CN'): string {
  const labels: Record<string, Record<ContentType, string>> = {
    'zh-CN': {
      [ContentType.TEXT]: '文本',
      [ContentType.URL]: '链接',
      [ContentType.EMAIL]: '邮箱',
      [ContentType.CODE]: '代码',
      [ContentType.FILE_PATH]: '文件路径',
      [ContentType.COLOR]: '颜色',
      [ContentType.NUMBER]: '数字',
      [ContentType.UNKNOWN]: '未知'
    },
    'zh-TW': {
      [ContentType.TEXT]: '文字',
      [ContentType.URL]: '連結',
      [ContentType.EMAIL]: '郵件',
      [ContentType.CODE]: '程式碼',
      [ContentType.FILE_PATH]: '檔案路徑',
      [ContentType.COLOR]: '顏色',
      [ContentType.NUMBER]: '數字',
      [ContentType.UNKNOWN]: '未知'
    },
    'en': {
      [ContentType.TEXT]: 'Text',
      [ContentType.URL]: 'URL',
      [ContentType.EMAIL]: 'Email',
      [ContentType.CODE]: 'Code',
      [ContentType.FILE_PATH]: 'File Path',
      [ContentType.COLOR]: 'Color',
      [ContentType.NUMBER]: 'Number',
      [ContentType.UNKNOWN]: 'Unknown'
    }
  };

  return labels[locale]?.[type] || labels['en'][type];
}
