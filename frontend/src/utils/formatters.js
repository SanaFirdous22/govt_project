/**
 * Utility functions for formatting data in the application
 */

// Format currency in Indian Rupees
export const formatCurrency = (amount, language = 'en') => {
  if (amount === null || amount === undefined) return 'N/A';

  return new Intl.NumberFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format large numbers with appropriate suffixes
export const formatNumber = (num, language = 'en') => {
  if (num === null || num === undefined) return 'N/A';

  return new Intl.NumberFormat(language === 'hi' ? 'hi-IN' : 'en-IN').format(num);
};

// Format percentage with sign
export const formatPercentage = (percent, showSign = true) => {
  if (percent === null || percent === undefined) return 'N/A';

  const sign = showSign && percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(1)}%`;
};

// Format date in readable format
export const formatDate = (dateString, language = 'en') => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (dateString, language = 'en') => {
  if (!dateString) return 'N/A';

  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return language === 'hi' ? 'अभी' : 'Just now';
    } else if (diffInHours < 24) {
      return language === 'hi'
        ? `${diffInHours} घंटे पहले`
        : `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return language === 'hi'
        ? `${diffInDays} दिन पहले`
        : `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown';
  }
};

// Get change direction and percentage
export const getChangeInfo = (current, previous) => {
  if (!previous || previous === 0) return null;

  const change = ((current - previous) / previous) * 100;
  const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'same';

  return {
    change: Math.abs(change),
    direction,
    changePercent: change
  };
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Convert district name to URL-friendly format
export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};
