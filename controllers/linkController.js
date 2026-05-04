import axios from "axios"
import * as cheerio from "cheerio";
import db from "../db/database.js";
import { diffLines } from "diff";
import { generateSummary } from "../services/llmService.js";

const formatDiffForLLM = (diffArray) => {
    return diffArray
        .map(part => {
            if (part.added) return `+ ${part.value}`
            if (part.removed) return `- ${part.value}`
            return '';
        })
    .join('\n');
}

export const linkController = async(req, res)=>{
    const {url} = req.body
    if(!url){
        return res.status(400).json({error:"URL is required"})
    }

    try {
        const response = await axios.get(url, {
            timeout: 5000,
            headers: { "User-Agent": "Mozilla/5.0" }
        });
        const html = response.data
        const $ = cheerio.load(html)

        $("script, style").remove();
        const text = $("body").text().replace(/\s+/g, " ").trim();
        res.json({
            message:'Fetched successfully',
            contentLength:text.length,
            preview:text.substring(0, 200)
        })
    } catch (error) {
        res.status(500).json({
            error:'Failed to fetch URL'
        })
    }
}

export const addLinkController = (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        new URL(url);
    } catch {
        return res.status(400).json({ error: "Invalid URL" });
    }

    try {
        const stmt = db.prepare(`
            INSERT INTO links (url) VALUES (?)
        `);

        const result = stmt.run(url);

        res.json({
            message: "Link added successfully",
            id: result.lastInsertRowid,
        });

    } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(400).json({ error: "Link already exists" });
        }

        console.error(error.message);
        res.status(500).json({ error: "Failed to add link" });
    }
};

export const deleteLinkController = (req, res)=>{
    const {id} = req.params

    try {
        const stmt = db.prepare(`
            DELETE FROM links WHERE id = ?
        `)

        const result = stmt.run(id)

        if (result.changes === 0){
            return res.status(404).json({
                error:"Link not found"
            })
        }

        res.json({
            message:"Link deleted sucessfully"
        })
    } catch (error) {
        console.error(error.message);
        
        res.status(500).json({
            error:"Failed to delete link"
        })
    }
}

export const checkLinkController = async (req, res) => {
    const {id} = req.params

    try {
        const link = db.prepare(`
            SELECT * FROM links WHERE id = ?
        `).get(id);

        if(!link){
            return res.status(404).json({error:"Link not found"})
        }

        const url = link.url;

        let response;
        try {
            response = await axios.get(url, {
                timeout: 5000,
                headers: { "User-Agent": "Mozilla/5.0" }
            });
        } catch (err) {
            return res.status(400).json({
                error: "Unable to fetch website (blocked, timeout, or invalid URL)"
            });
        }
        const html = response.data

        const $ = cheerio.load(html)
        $("script, style").remove();
        const newText = $("body")
        .text()
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 20000);

        const lastSnapshot = db.prepare(`
            SELECT * FROM snapshots
            WHERE link_id = ?
            ORDER BY created_at DESC
            LIMIT 1
        `).get(id);

        let diffResult = []
        let hasChanges = true
        let evidence = [] 

        if (lastSnapshot){
            const oldText = lastSnapshot.content

            const diff = diffLines(oldText, newText)

            diffResult = diff
                .filter(part => part.added || part.removed)
                .map(part => ({
                    added: part.added || false,
                    removed: part.removed || false,
                    value: part.value
                }));
            
            

            hasChanges = diff.some(part => part.added || part.removed)
        }

        if (lastSnapshot) {
    evidence = diffResult
        .filter(d => d.added || d.removed)
        .map(d => {
            const clean = d.value
                .replace(/\s+/g, " ")
                .trim()
                .split("\n")[0]
                .slice(0, 100);

            return (d.added ? "+ " : "- ") + clean;
        })
        .filter(line => line.length > 10) // remove useless tiny lines
        .slice(0, 5);
}

        let summary = null;

        if (hasChanges && diffResult.length > 0) {
            const diffText = formatDiffForLLM(diffResult);

            if (diffText.length > 50) {
                summary = await generateSummary(diffText.slice(0, 5000));
            }
        }
        if (!lastSnapshot || hasChanges) {
            db.prepare(`
                INSERT INTO snapshots (link_id, content, summary, diff, evidence)
                VALUES (?, ?, ?, ?, ?)
            `).run(
                id,
                newText,
                summary || "No changes detected",
                JSON.stringify(diffResult),
                JSON.stringify(evidence)
            );
        }

        res.json({
            message:hasChanges?"Changes detected" : "No changes",
            hasChanges,
            diff: diffResult,
            summary:summary || "No changes detected",
            evidence
        })
    } catch (error) {
        console.error(error.message);
        
        res.status(500).json({
            error:"Failed to check link"
        })
    }
}

export const getStatusController = (req, res) => {
    const {id} = req.params;

    try {
        const link = db.prepare(`
            SELECT * FROM links WHERE id = ?
        `).get(id)

        if (!link){
            return res.status(404).json({error:"Link not found"});
        }

        const latestSnapshot = db.prepare(`
            SELECT * FROM snapshots
            WHERE link_id = ?
            ORDER BY created_at DESC
            LIMIT 1    
        `).get(id)

        const history = db.prepare(`
            SELECT created_at
            FROM snapshots
            WHERE link_id = ?
            ORDER BY created_at DESC
            LIMIT 5
        `).all(id)

        res.json({
        url: link.url,
        latest: latestSnapshot
            ? {
                summary: latestSnapshot.summary,
                diff: (() => {
    try {
        return JSON.parse(latestSnapshot.diff || "[]");
    } catch {
        return [];
    }
})(),
evidence: (() => {
    try {
        return JSON.parse(latestSnapshot.evidence || "[]");
    } catch {
        return [];
    }
})(),
created_at: latestSnapshot.created_at
            }
        : null,
        history: history
    })
    } catch (error) {
        console.error(error.message);
        
        res.status(500).json({error:"Failed to fetch status"})
    }
}

export const getAllLinksController = (req, res) => {
    try {
        const links = db.prepare(`
            SELECT 
                l.id,
                l.url,
                s.diff
            FROM links l
            LEFT JOIN snapshots s 
                ON s.link_id = l.id
                AND s.id = (
                    SELECT id FROM snapshots 
                    WHERE link_id = l.id 
                    ORDER BY created_at DESC 
                    LIMIT 1
                )
            ORDER BY l.created_at DESC
        `).all()

        res.json(links)
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            error: "Failed to fetch links"
        })
    }
}
