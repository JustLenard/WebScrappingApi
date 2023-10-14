## Prerequisites

To run the backend application, you need to have the following installed:

- [Node.js](https://nodejs.org/en)
- [A package a manager (yarn , npm, pnpm)](https://yarnpkg.com/getting-started)

## Getting the Server up and running

1. **Clone the repository if you didn't yet:**

   ```bash
   git clone https://github.com/JustLenard/WebScrappingApi.git
   ```

2. **Change directory to server:**

   ```bash
   cd server
   ```

3. **Install dependencies:**

   ```bash
   npm i
   ```

4. **Create .env file:**

   ```bash
   touch .env
   ```

5. **Add .env variables:**

   ```bash
   PORT=5000
   ```

6. **Build app:**

   ```bash
   npm run build

   ```

7. **(Optional) Watch for changes:**

   ```bash
   npm run build:watch
   ```

8. **Start app:**

   ```bash
   npm start
   ```

# API Route Documentation: `/api/scrape`

## Description

This route allows you to initiate web scraping by providing a target URL and specifying the data points to scrape.

## Endpoint

- **Method:** POST
- **URL:** `/api/scrape`

## Request Body

- **Content-Type:** application/json

### Request Body Example

```json
{
  "linkToScrape": "string",
  "dataPointsToScrape": [
    "title",
    "image",
    "href",
    "short_description",
    "time",
    "length",
    "article_category",
    "sentiment",
    "author_image",
    "author_name",
    "author_occupation"
  ]
}
```

```json
{
  "linkToScrape": "string",
  "dataPointsToScrape": "all"
}
```

## Response

- **Status Code:** 200 (OK)
- **Content-Type:** application/json

## Response Body Example

```json
[
  {
    "title": "The Joys of Gardening",
    "image": "https://wsa-test.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgarden.8d6b6c5f.webp&w=3840&q=75",
    "href": "https://wsa-test.vercel.app/blog/the-joys-of-gardening",
    "short_description": "Explore the enriching world of gardening and discover its positive impact on mood and well-being.",
    "time": "September 16, 2023",
    "article_category": "Lifestyle"
  },
  {
    "title": "The Challenges of Urban Living",
    "image": "https://wsa-test.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Furban.b1d13747.webp&w=3840&q=75",
    "href": "https://wsa-test.vercel.app/blog/the-challenges-of-urban-living",
    "short_description": "A candid look at the challenges of urban living, with insights into coping strategies.",
    "time": "September 15, 2023",
    "article_category": "Urban Life"
  }
]
```
