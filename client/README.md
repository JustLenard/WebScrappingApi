## Prerequisites

To run the frontend application, you need to have the following installed:

-   [Node.js](https://nodejs.org/en)
-   [A package a manager (yarn , npm, pnpm)](https://yarnpkg.com/getting-started)

## Getting the FrontEnd up and running

1. **Clone the repository if you didn't yet:**

    ```bash
    git clone https://github.com/JustLenard/WebScrappingApi.git
    ```

2. **Change directory to client:**

    ```bash
    cd client
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
    VITE_APP_API="http://localhost:5000/api"
    ```

6. **Start:**

    ```bash
    npm run dev
    ```
