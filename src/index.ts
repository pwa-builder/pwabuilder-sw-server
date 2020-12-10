import { Request, Response } from "express";
import { getCodePreview } from "./controllers/code-preview";
import { downloadSW } from "./controllers/download";
import { handleListing } from "./controllers/listing";

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/listing", async (req: Request, res: Response) => {
  await handleListing(req, res);
});

app.get("/codePreview", async (req: Request, res: Response) => {
    await getCodePreview(req, res);
});

app.get("/download", async (req: Request, res: Response) => {
    await downloadSW(req, res);
})

app.get("/", (req: Request, res: Response) => {
  res.send("The app is running");
});

app.listen(port, () => {
  console.log(`app listening at ${port}`);
});
