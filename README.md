# Webcrawler

Minimal webcrawler API in NodeJS with Typescript.

## Libraries used

- express: node.js api framework to build our api.
- cors: enable cross origin in our project.
- dotenv: read environment variables from .env files to create dynamic environment.
- morgan: logging middleware for debugging and monitoring app activities.
- http-status-code: facilitate sending http status codes in responses.
- jest: library for testing.
- axios: To fetch urls.
- cheerio: parse html urls
- axios-retry: To prevent request overload. 

## Usage

1. Install dependencies.
2. Add a `.env` file with the following variables: `NODE_ENV` and `PORT`
3. Run proyect with `npm run start`

## Endpoint

- `/webcrawler/crawl?url=&maxDepth=&maxPages`
  - url: Url to crawl.
  - maxDepth: Max level of depth to crawl in a website.
  - maxPages: Max level of pages to crawl.

