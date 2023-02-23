/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import { graphql, useStaticQuery } from "gatsby"
import * as React from "react"

function Seo({
  description,
  title,
  children,
}: {
  description?: string
  title: string
  children?: React.ReactNode
}) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title
  const formattedTitle = defaultTitle ? `${title} — ${defaultTitle}` : title

  return (
    <>
      <title>{formattedTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={site.siteMetadata?.author || ``} />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {children}
    </>
  )
}

export default Seo
