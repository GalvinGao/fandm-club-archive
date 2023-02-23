/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions }) => {
  const { data } = await graphql(`
    query {
      allMysqlClubs {
        nodes {
          mysqlId
          name
        }
      }
    }
  `)

  data.allMysqlClubs.nodes.forEach(node => {
    actions.createPage({
      path: `/clubs/${node.mysqlId}`,
      component: require.resolve(`./src/templates/club.tsx`),
      context: {
        mysqlId: {
          eq: node.mysqlId,
        },
      },
    })
  })
}
