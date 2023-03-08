/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Old Budget Site Archive — Club Council`,
    description: `An archive of the clubs at Franklin & Marshall College from 2008-2021.`,
    author: `@galvingao`,
    siteUrl: `https://fandm.edu/`,
  },
  plugins: [
    "gatsby-plugin-postcss",
    "gatsby-plugin-image",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#163a6d`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#163a6d`,
        display: `minimal-ui`,
        icon: `static/images/logo-square.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-source-mysql`,
      options: {
        connectionDetails: {
          host: "127.0.0.1",
          user: "root",
          password: "root",
          database: "clubcouncilold",
        },
        queries: [
          {
            statement: "SELECT * FROM club",
            idFieldName: "id",
            name: "clubs",
          },
          {
            statement: "SELECT * FROM budgetitems",
            idFieldName: "id",
            name: "budgetItems",
          },
          {
            statement: "SELECT * FROM usermapping",
            idFieldName: "name",
            name: "userMappings",
          },
        ],
      },
    },
  ],
}
