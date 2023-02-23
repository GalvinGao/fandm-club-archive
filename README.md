<!-- AUTO-GENERATED-CONTENT:START (STARTER) -->
<p align="center">
  <a href="https://www.gatsbyjs.com">
    <img alt="Gatsby" src="https://raw.githubusercontent.com/GalvinGao/fandm-club-archive/main/static/images/logo.png" width="200" />
  </a>
</p>
<h1 align="center">
  Club Archive
</h1>

This is the Club Archive project for the Franklin & Marshall College Club Council. The project is built with Gatsby and is both rendered as PDFs and is ready to be hosted.

## Prerequisites

- Node.js 18 or higher; see [Node.js](https://nodejs.org/en/download/) for installation instructions.
  - use `nvm` to install Node.js is highly recommended. After installing `nvm`, run `nvm use` to install the correct version of Node.js.
- A valid Club Council "Old Budget Side" dump file, imported to a MySQL database.
  - The dump file is available from the Club Council's Google Drive.
  - The database should be named `clubcouncilold`.
  - Afterwards, change the `host`, `user`, and `password` fields in `gatsby-config.js` to match your database's credentials.
  - The database should be accessible from the machine you are running the project on.

## Setup

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run develop` to start the development server

## Deployment

1. Run `npm run render` to both build the site and render the PDFs. Please do not keep the development server running while building the site as it will cause the build to fail (due to Gatsby's caching issues).

## License

This project is licensed under the 0BSD license. See the [LICENSE](./LICENSE) file for details.
