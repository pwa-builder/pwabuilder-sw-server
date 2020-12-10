import { Request, Response } from 'express';
import { getServiceWorkersDescription } from "pwabuilder-serviceworkers";

const fs = require("fs/promises");

export const handleListing = async (req: Request, res: Response) => {
  try {
    const listingData = getServiceWorkersDescription();

    if (listingData) {
      try {
        const data = await fs.readFile(listingData, "utf8");

        if (data) {
          res.status(200).json(data);
        }
      } catch (err) {
        console.error(`Error getting service workers listing file: ${err}`);
        res.status(500).send(err);
      }
    }
  } catch (err) {
    console.error(`Error getting service workers listing data: ${err}`);
    res.status(500).send(err);
  }
};
