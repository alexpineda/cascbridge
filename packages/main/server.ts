import express from "express";
import * as casclib from "./lib/casclib";
import { win } from "./window";

export const server = express();

server.use(function (_, res, next) {
    res.setHeader("Origin-Agent-Cluster", "?1")
    res.setHeader("Access-Control-Allow-Origin", "*");
    next()
})

casclib.setStorageIsDisk(false);

server.get("*", async function (req, res) {
    if (req.query["open"] ) {
        try {
            await casclib.openCascStorage(); 
            res.sendStatus(200);
            res.end();
            return;
        } catch (e) {
            console.error(e);
            res.sendStatus(404)
            res.end();
            return;
        }
    } else if (req.query["close"]) {
        casclib.closeCascStorage();
        res.sendStatus(200);
        res.end();
        return
    }
    try {
        win.webContents.send("server-log", "requested: " + req.path.slice(1))
        const data = await casclib.readCascFile(req.path.slice(1), true);
        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.send(data);
        res.end();
    } catch (e) {
        win.webContents.send("server-log", "error: " + (e as Error).message)
        res.sendStatus(404)
        res.end();
        return;
    }

    
    return;

});