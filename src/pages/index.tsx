// If you don't want to use TypeScript you can delete this file!
import { graphql, HeadFC, Link, PageProps } from "gatsby"
import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"

type DataProps = {
  allMysqlClubs: {
    nodes: {
      mysqlId: number
      name: string
    }[]
  }
}

export const query = graphql`
  query {
    allMysqlClubs {
      nodes {
        mysqlId
        name
      }
    }
  }
`

function ClubLink({
  club,
}: {
  club: DataProps["allMysqlClubs"]["nodes"][number]
}): JSX.Element {
  return (
    <li key={club.mysqlId}>
      <Link
        to={`/clubs/${club.mysqlId}`}
        className="inline-flex px-4 py-2 no-underline border border-solid border-primary hover:bg-primary hover:text-white active:brightness-150"
      >
        {club.name}
      </Link>
    </li>
  )
}

const Index: React.FC<PageProps<DataProps>> = ({ data }) => {
  const clubs = data.allMysqlClubs.nodes
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))

  const featuredClubIds = [
    51, 288, 181, 31, 69, 140, 78, 43, 66, 107, 25, 274, 143, 45,
  ]

  return (
    <Layout>
      <h1 className="text-4xl font-bold tracking-tighter text-primary mb-4">
        Featured
      </h1>
      <h2 className="text-lg tracking-tight mb-4">
        Featured historical clubs are clubs that have the most completed data.
      </h2>

      <ul className="flex flex-col gap-2">
        {clubs
          .filter(club => featuredClubIds.includes(club.mysqlId))
          .map(club => (
            <ClubLink key={club.mysqlId} club={club} />
          ))}
      </ul>

      <h1 className="text-4xl font-bold tracking-tighter text-primary mb-4 mt-8">
        All Clubs
      </h1>
      <ul className="flex flex-col gap-2">
        {clubs.map(club => (
          <ClubLink key={club.mysqlId} club={club} />
        ))}
      </ul>
    </Layout>
  )
}

export const Head: HeadFC<DataProps> = () => <Seo title="Homepage" />

export default Index
