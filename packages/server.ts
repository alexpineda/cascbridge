import express from "express";
import * as casclib from "bw-casclib";

export const server = express();
let _handle: any = null;

export const opts = {
    path: ""
}

server.use(function (_, res, next) {
    res.setHeader("Origin-Agent-Cluster", "?1")
    res.setHeader("Access-Control-Allow-Origin", "*");
    next()
})

server.get("*", async function (req, res) {
    if (_handle === null) {
        console.log("opening path " + opts.path)
        _handle = await casclib.openStorage(opts.path);
    }
    console.log("requesting " + req.path.slice(1))
    const data = await casclib.readFile(_handle, req.path.slice(1));

    res.setHeader("Content-Type", "application/octet-stream");
    res.send(data);
    res.end();
    return;

});