import express from "express";
import * as casclib from "./lib/casclib";
import { win } from "./window";

export const server = express();

server.use(function (_, res, next) {
  res.setHeader("Origin-Agent-Cluster", "?1");
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

casclib.setStorageIsDisk(false);

server.head("*", async function (req, res) {

    try {
        const data = await casclib.readCascFile(req.path.slice(1), true);

        const fileSize = data.byteLength;  // Assume casclib.getFileSize method exists
        
        res.setHeader("Content-Length", fileSize.toString());
        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader("Accept-Ranges", "bytes");  // Optional, but useful if you support range requests
        res.status(200).end();  // Respond with 200 OK and no body
    } catch (e) {
        console.error(e);
        res.sendStatus(404);  // Respond with 404 Not Found if there's an error
        res.end();
    }

});

server.get("*", async function (req, res) {
  if (req.query["open"]) {
    try {
      await casclib.openCascStorage();
      res.sendStatus(200);
      res.end();
      return;
    } catch (e) {
      console.error(e);
      res.sendStatus(404);
      res.end();
      return;
    }
  } else if (req.query["close"]) {
    casclib.closeCascStorage();
    res.sendStatus(200);
    res.end();
    return;
  }
  try {
    win.webContents.send("server-log", "requested: " + req.path.slice(1));

    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const fileData = await casclib.readCascFile(req.path.slice(1), true);
      const end = parts[1] ? parseInt(parts[1], 10) : fileData.byteLength - 1;

      console.log("serving", start, end, fileData.byteLength)

      if (start >= fileData.byteLength) {
        console.log("Requested range not satisfiable");
        res.status(416).send("Requested Range Not Satisfiable");
        return;
      }

      const chunksize = end - start;
      const data = fileData.subarray(start, end) // Assume casclib.readCascFile supports range read

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileData.byteLength}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "application/octet-stream",
      });
      res.end(data);
    } else {
      const data = await casclib.readCascFile(req.path.slice(1), true);
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.send(data);
      res.end();
    }
  } catch (e) {
    win.webContents.send("server-log", "error: " + (e as Error).message);
    res.sendStatus(404);
    res.end();
    return;
  }

  return;
});
