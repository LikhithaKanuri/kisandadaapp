import * as SQLite from 'expo-sqlite';

let db = null;

export const init = async () => {
    try {
        db = await SQLite.openDatabaseAsync('kisandada.db');
        await db.execAsync(
            'CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY NOT NULL, token TEXT NOT NULL);'
        );
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