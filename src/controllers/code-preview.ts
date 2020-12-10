import { Request, Response } from "express";
import { getAssetsFolders } from "pwabuilder-serviceworkers";

const fs = require("fs/promises");
const path = require("path");

export const getCodePreview = async (req: Request, res: Response) => {
  const chosenID = req.query.id;

  if (chosenID) {
    const assetFolders = await getAssetsFolders(chosenID);

    if (assetFolders) {
      console.log(assetFolders);

      assetFolders.map(async (folderPath: string) => {
        const files: string[] = await fs.readdir(folderPath);
        console.log(files);

        const registerPath = files.find((path) => {
          return path.includes("register");
        });
        console.log(registerPath);

        const swPath = files.find((path) => {
          return !path.includes("register");
        });

        if (registerPath) {
          const websiteCode = await fs.readFile(
            path.join(folderPath, registerPath),
            "utf8"
          );
          const swCode = await fs.readFile(
            path.join(folderPath, swPath),
            "utf8"
          );

          if (websiteCode && swCode) {
            res.status(200).json({
              webSite: websiteCode,
              serviceWorker: swCode,
            });
          }
          else {
              res.status(500).send("Couldnt find requested service worker");
          }
        }
      });
    }
  } else {
    res.status(500).send("You must pass an ID");
  }
};
