import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Webcrawler from "../../services/webcrawler";

let router = Router();

router.get('/crawl', async (req: Request, res: Response, next: Function) => {
    try {

        // Get the URL from the query parameters
        const url = req.query.url as string;
        if (!url) {
            return res.status(StatusCodes.BAD_REQUEST).send({ message: "URL query parameter is required" });
        }
        // GET maxDepth and maxPages from the query parameters
        const maxDepth = parseInt(req.query.maxDepth as string) || 5;
        const maxPages = parseInt(req.query.maxPages as string) || 100;

        // Call the webcrawler service
        const response = await Webcrawler.getInstance().crawl(url, maxDepth, maxPages);

        // Empty the visited set
        Webcrawler.getInstance().clearVisited();

        // Return the response
        return res.status(StatusCodes.OK).send(response);

    } catch (error) {
        // Call errorHandling middleware
        next(error);
    }
});

export default router;