import { Request, Response } from "express";
import { getAssetsFolders } from "pwabuilder-serviceworkers";
import del from "del";

const tmp = require("tmp");
const archiver = require("archiver");

const tempFileRemovalTimeoutMs = 1000 * 60 * 5; // 5 minutes
tmp.setGracefulCleanup();

const fs = require("fs/promises");
const normalFS = require("fs");

export const downloadSW = async (req: Request, res: Response) => {
  const chosenID = req.query.id;

  const assetFolders = await getAssetsFolders(chosenID);

  if (assetFolders) {
    const archive = archiver("zip", {
      zlib: { level: 5 },
    });

    archive.on("warning", (zipWarning: any) => {
      console.warn("Warning during zip creation", zipWarning);
    });

    archive.on("error", (zipError: any) => {
      console.error("Error during zip creation", zipError);
      res.status(500).send(`Error during zip creation: ${zipError}`);
    });

    let tmpZipFile = tmp.tmpNameSync({
      prefix: "pwabuilder-serviceworker-",
      postfix: ".zip",
    });

    const output = normalFS.createWriteStream(tmpZipFile);

    output.on("close", () => {
      if (tmpZipFile) {
        res.status(200).sendFile(tmpZipFile);

        scheduleTmpFileCleanup(tmpZipFile);
      } else {
        console.error("No zip file was created");
        res.status(500).send(`No zip file was created`);
        
        scheduleTmpFileCleanup(tmpZipFile);
      }
    });

    archive.pipe(output);

    assetFolders.map(async (folderPath: string) => {
      if (folderPath) {
        console.log(folderPath);

        archive.directory(folderPath, "pwabuilder-sw");
      }
    });

    archive.finalize();
  }
};

function scheduleTmpFileCleanup(file: string | null) {
  if (file) {
    console.info("Scheduled cleanup for tmp file", file);
    const delFile = function () {
      const filePath = file.replace(/\\/g, "/"); // Use / instead of \ otherwise del gets failed to delete files on Windows
      del([filePath], { force: true })
        .then((deletedPaths: string[]) =>
          console.info("Cleaned up tmp file", deletedPaths)
        )
        .catch((err: any) =>
          console.warn(
            "Unable to cleanup tmp file. It will be cleaned up on process exit",
            err,
            filePath
          )
        );
    };
    setTimeout(() => delFile(), tempFileRemovalTimeoutMs);
  }
}
