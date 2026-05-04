import db from "./database.js";

export const initDB = () => {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS links(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS snapshots(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            link_id INTEGER,
            content TEXT,
            summary TEXT,
            diff TEXT,
            evidence TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
        )
    `).run();

    const count = db.prepare("SELECT COUNT(*) as count FROM links").get();

    if (count.count === 0) {
        console.log("Seeding initial links...");

        const insert = db.prepare(`
            INSERT INTO links (url) VALUES (?)
        `);

        const links = [
            "https://example.com",
            "https://openai.com/pricing",
            "https://vercel.com/pricing",
            "https://render.com/pricing",
            "https://blog.google",
            "https://stripe.com/privacy"
        ];

        for (const url of links) {
            insert.run(url);
        }
    }
    console.log("Database has been initialized");
};