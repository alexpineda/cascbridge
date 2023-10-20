import express from "express";
import * as casclib from "./lib/casclib";
import { win } from "./window";

export const server = express();

export const opts = {
    path: ""
}

server.use(function (_, res, next) {
    res.setHeader("Origin-Agent-Cluster", "?1")
    res.setHeader("Access-Control-Allow-Origin", "*");
    next()
})

casclib.setStorageIsCasc(true);

server.get("*", async function (req, res) {
    if (req.query["open"] ) {
        try {
            await casclib.openCascStorage(opts.path);
            res.send("ok");
            res.end();
        return;
        } catch (e) {
            console.error(e);
            res.sendStatus(404).send(e.message);
            res.end();
            return;
        }
    } else if (req.query["close"]) {
        casclib.closeCascStorage();
        res.send("ok");
        res.end();
        return
    }
    try {
        win.webContents.send("server-log", "requested: " + req.path.slice(1))
        const data = await casclib.readCascFile(req.path.slice(1));
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(data);
    res.end();
    } catch (e) {
        res.send(404);
        res.end();
        return;
    }

    
    return;

});