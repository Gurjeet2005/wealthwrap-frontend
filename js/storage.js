/**
 * LocalStorage Wrapper
 */
const DB_NAME = 'wealthwrap_v1';

export const Storage = {
    get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(DB_NAME);
            if (!data) return defaultValue;
            const parsed = JSON.parse(data);
            return parsed[key] !== undefined ? parsed[key] : defaultValue;
        } catch (e) {
            console.error('Storage Read Error', e);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            const data = localStorage.getItem(DB_NAME);
            const parsed = data ? JSON.parse(data) : {};
            parsed[key] = value;
            localStorage.setItem(DB_NAME, JSON.stringify(parsed));
            return true;
        } catch (e) {
            console.error('Storage Write Error', e);
            return false;
        }
    },

    update(key, callback) {
        const current = this.get(key);
        const unique = callback(current);
        this.set(key, unique);
        return unique;
    },

    remove(key) {
        try {
            const data = localStorage.getItem(DB_NAME);
            if (data) {
                const parsed = JSON.parse(data);
                delete parsed[key];
                localStorage.setItem(DB_NAME, JSON.stringify(parsed));
            }
        } catch (e) {
            console.error('Storage Remove Error', e);
        }
    },

    // Nuclear option
    clear() {
        localStorage.removeItem(DB_NAME);
    }
};
