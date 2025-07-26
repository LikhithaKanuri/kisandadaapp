import * as SQLite from 'expo-sqlite';

let db = null;

export const init = async () => {
    try {
        db = await SQLite.openDatabaseAsync('kisandada.db');
        await db.execAsync(
            'CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY NOT NULL, token TEXT NOT NULL);'
        );
        await db.execAsync(
            'CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY NOT NULL, language TEXT NOT NULL DEFAULT "en");'
        );
        const result = await db.getFirstAsync('SELECT COUNT(*) as count FROM settings');
        if (result.count === 0) {
            await db.runAsync('INSERT INTO settings (language) VALUES ("en");');
        }
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
};

export const saveSession = async (token) => {
    if (!db) throw new Error("Database not initialized");
    try {
        await db.withTransactionAsync(async () => {
            await db.runAsync('DELETE FROM sessions;');
            await db.runAsync('INSERT INTO sessions (token) VALUES (?);', token);
        });
    } catch (error) {
        console.error('Failed to save session:', error);
        throw error;
    }
};

export const getSession = async () => {
    if (!db) throw new Error("Database not initialized");
    try {
        const result = await db.getFirstAsync('SELECT token FROM sessions LIMIT 1;');
        return result?.token;
    } catch (error) {
        console.error('Failed to get session:', error);
        throw error;
    }
};

export const deleteSession = async () => {
    if (!db) throw new Error("Database not initialized");
    try {
        await db.runAsync('DELETE FROM sessions;');
    } catch (error) {
        console.error('Failed to delete session:', error);
        throw error;
    }
};

export const saveLanguage = async (language) => {
    if (!db) throw new Error("Database not initialized");
    try {
        await db.runAsync('UPDATE settings SET language = ? WHERE id = 1;', language);
    } catch (error) {
        console.error('Failed to save language:', error);
        throw error;
    }
};

export const getLanguage = async () => {
    if (!db) throw new Error("Database not initialized");
    try {
        const result = await db.getFirstAsync('SELECT language FROM settings LIMIT 1;');
        return result?.language;
    } catch (error) {
        console.error('Failed to get language:', error);
        throw error;
    }
};