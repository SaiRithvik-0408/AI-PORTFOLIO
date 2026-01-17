/**
 * CodeChef API Utility
 * Fetches user statistics from CodeChef using community API
 */

const CODECHEF_API_URL = 'https://codechef-api.vercel.app';
// Alternative: 'https://competitive-coding-api.herokuapp.com/api/codechef'
const CACHE_KEY_PREFIX = 'codechef_stats_';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Fetches CodeChef statistics for a given username
 * @param {string} username - CodeChef username
 * @returns {Promise<Object>} User statistics
 */
export async function fetchCodeChefStats(username) {
    try {
        // Check cache first
        const cached = getCachedData(username);
        if (cached) {
            console.log('Using cached CodeChef data');
            return cached;
        }

        console.log('Fetching fresh CodeChef data...');

        // Fetch from API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`${CODECHEF_API_URL}/handle/${username}`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();

        // Check if the API returned an error
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch CodeChef data');
        }

        // Transform API response to match our data structure
        const stats = {
            rating: data.currentRating || 0,
            stars: data.stars || '0★',
            globalRank: data.globalRank || 'N/A',
            countryRank: data.countryRank || 'N/A',
            highestRating: data.highestRating || 0
        };

        // Cache the result
        cacheData(username, stats);

        return stats;
    } catch (error) {
        console.error('Error fetching CodeChef stats:', error);

        // Return null to indicate failure (component will use fallback data)
        return null;
    }
}

/**
 * Gets cached data if available and not expired
 * @param {string} username - CodeChef username
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
 * @param {string} username - CodeChef username
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
 * @param {string} username - CodeChef username
 */
export function clearCodeChefCache(username) {
    try {
        const cacheKey = CACHE_KEY_PREFIX + username;
        localStorage.removeItem(cacheKey);
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
}

/**
 * Gets the timestamp of when data was last cached
 * @param {string} username - CodeChef username
 * @returns {number|null} Timestamp or null
 */
export function getCodeChefCacheTimestamp(username) {
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
