/**
 * LeetCode API Utility
 * Fetches user statistics from LeetCode using community API
 */

const LEETCODE_API_URL = 'https://alfa-leetcode-api.onrender.com';
const CACHE_KEY_PREFIX = 'leetcode_stats_';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Fetches LeetCode statistics for a given username
 * @param {string} username - LeetCode username
 * @returns {Promise<Object>} User statistics
 */
export async function fetchLeetCodeStats(username) {
    try {
        // Check cache first
        const cached = getCachedData(username);
        if (cached) {
            console.log('Using cached LeetCode data');
            return cached;
        }

        console.log('Fetching fresh LeetCode data...');

        // Fetch from API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`${LEETCODE_API_URL}/${username}`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();

        // Transform API response to match our data structure
        const stats = {
            solved: data.totalSolved || 0,
            easy: data.easySolved || 0,
            medium: data.mediumSolved || 0,
            hard: data.hardSolved || 0,
            ranking: data.ranking ? `#${data.ranking.toLocaleString()}` : 'N/A',
            acceptanceRate: data.acceptanceRate || 0,
            contributionPoints: data.contributionPoints || 0
        };

        // Cache the result
        cacheData(username, stats);

        return stats;
    } catch (error) {
        console.error('Error fetching LeetCode stats:', error);

        // Return null to indicate failure (component will use fallback data)
        return null;
    }
}

/**
 * Gets cached data if available and not expired
 * @param {string} username - LeetCode username
 * @returns {Object|null} Cached data or null
 */
function getCachedData(username) {
    try {
        const cacheKey = CACHE_KEY_PREFIX + username;
        const cached = localStorage.getItem(cacheKey);

        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is still valid
        if (now - timestamp < CACHE_DURATION) {
            return data;
        }

        // Cache expired, remove it
        localStorage.removeItem(cacheKey);
        return null;
    } catch (error) {
        console.error('Error reading cache:', error);
        return null;
    }
}

/**
 * Caches data with timestamp
 * @param {string} username - LeetCode username
 * @param {Object} data - Data to cache
 */
function cacheData(username, data) {
    try {
        const cacheKey = CACHE_KEY_PREFIX + username;
        const cacheValue = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheValue));
    } catch (error) {
        console.error('Error caching data:', error);
    }
}

/**
 * Clears cached data for a username
 * @param {string} username - LeetCode username
 */
export function clearLeetCodeCache(username) {
    try {
        const cacheKey = CACHE_KEY_PREFIX + username;
        localStorage.removeItem(cacheKey);
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
}

/**
 * Gets the timestamp of when data was last cached
 * @param {string} username - LeetCode username
 * @returns {number|null} Timestamp or null
 */
export function getLeetCodeCacheTimestamp(username) {
    try {
        const cacheKey = CACHE_KEY_PREFIX + username;
        const cached = localStorage.getItem(cacheKey);

        if (!cached) return null;

        const { timestamp } = JSON.parse(cached);
        return timestamp;
    } catch (error) {
        console.error('Error getting cache timestamp:', error);
        return null;
    }
}
