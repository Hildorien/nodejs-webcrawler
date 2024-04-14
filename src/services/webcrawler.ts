import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import cheerio from 'cheerio';
import { StatusCodes } from 'http-status-codes';
import url from 'url';
import VisitedSite from '../models/visitedSite';

class Webcrawler {
    private static instance: Webcrawler;
    private axiosInstance: AxiosInstance;
    private visited: Set<VisitedSite>;

    private static readonly MAX_RETRIES = 3;
    private static readonly RETRY_DELAY_MS = 1000;


    private constructor() {
        this.visited = new Set();
        this.axiosInstance = axios.create();
        axiosRetry(this.axiosInstance, {
            retries: Webcrawler.MAX_RETRIES, retryDelay: (retryCount) => {
                let interval = Webcrawler.RETRY_DELAY_MS * retryCount;
                //console.log(`Webcrawler request failed. Attempt #${retryCount} will occur after ${interval}ms`);
                return interval;
            }, retryCondition: (error) => {
                return error.response?.status === StatusCodes.TOO_MANY_REQUESTS;
            }
        });
    }

    public static getInstance(): Webcrawler {
        if (!Webcrawler.instance) {
            Webcrawler.instance = new Webcrawler();
        }
        return Webcrawler.instance;
    }


    public async crawl(startUrl: string, maxDepth: number = 5, maxPages: number = 100): Promise<VisitedSite[]> {
        if (this.visited.size >= maxPages || maxDepth < 0) {
            return Array.from(this.visited);
        }

        if (Array.from(this.visited).some(site => site.url === startUrl)) {
            return Array.from(this.visited);
        }

        const start = process.hrtime();
        try {
            const response = await this.axiosInstance.get(startUrl);
            const $ = cheerio.load(response.data);

            const elapsed = process.hrtime(start);
            const loadTime = elapsed[0] * 1000 + elapsed[1] / 1e6; // convert to milliseconds

            this.visited.add({
                url: startUrl,
                loadingTimeMs: loadTime,
                status: response.status === 200
            });

            const links = Array.from($('a'));
            for (const element of links) {
                if (this.visited.size < maxPages) {
                    const href = $(element).attr('href');
                    const absoluteUrl = url.resolve(startUrl, href || "");
                    if (absoluteUrl.startsWith('http:') || absoluteUrl.startsWith('https:')) {
                        this.crawl(absoluteUrl, maxDepth - 1, maxPages);
                    }
                }
            }
        } catch (error: any) {
            //console.error(`Failed to crawl "${startUrl}": ${error.message}`);
            throw error;
        }

        return Array.from(this.visited);
    }

    public clearVisited(): void {
        this.visited.clear();
    }
}

export default Webcrawler;