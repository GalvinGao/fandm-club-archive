import { graphql, HeadProps, PageProps } from "gatsby"
import * as React from "react"

import mdiCode from "@iconify/icons-mdi/code"
import { Icon } from "@iconify/react"
import clsx from "clsx"
import {
  Alert,
  ContactCard,
  MultiColumn,
  OutboundLink,
  Paper,
  Paragraphs,
  Section,
  StatsCard,
} from "../components/clubs/foundation"
import { ClubDataProps, remapClubDataset } from "../components/clubs/model"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { formatCurrency, formatTime, formatTimeShort } from "../utils/formatter"

export const query = graphql`
  query ($mysqlId: IntQueryOperatorInput) {
    mysqlClubs(mysqlId: $mysqlId) {
      id
      name
      descri
      intClubType
      slug
      desc
      welcTitle
      welcText
      url
      facebook
      twitter
      isActive
      isRecognized
      account_number
      board_short
      adv_short
      members
      dues
      calendar
      name1_short
      role1
      name2_short
      role2
      name3_short
      role3
      name4_short
      role4
      name5_short
      role5
      name6_short
      role6
      name7_short
      role7
      name8_short
      role8
      name9_short
      role9
      name10_short
      role10
      sub_short
      sub_phone
      created
      constit
      budget_closed
      appt_set
      budget_set
      connections
      no_budget
      mysqlId
    }
    allMysqlBudgetItems(filter: { club_id: $mysqlId }) {
      nodes {
        id
        name
        descri
        date
        semester_id
        type_id
        club_id
        creator
        attendees
        exp1
        cost1
        req1
        grant1
        exp2
        cost2
        req2
        grant2
        exp3
        cost3
        req3
        grant3
        cost4
        exp4
        req4
        grant4
        exp5
        cost5
        req5
        grant5
        total
        request_total
        grant_total
        status
        created
        sa
        mysqlId
      }
    }
  }
`

const Footer: React.FC<{
  club: ReturnType<typeof remapClubDataset>
  buildTime: string
}> = ({ club, buildTime }) => (
  <code className="text-[12px] text-zinc-600 py-4 px-4 border-[thin] border-solid border-zinc-400 mt-4 flex flex-col gap-4 break-inside-avoid-page">
    <div className="text-xl font-semibold tracking-tighter flex items-center justify-between">
      <span>Technical Information</span>

      <Icon icon={mdiCode} className="ml-2" />
    </div>
    <div>
      This document was built at {buildTime} and rendered at{" "}
      {new Date().toISOString()}.
    </div>
    <div>Database Club ID: {club.mysqlId}.</div>
    <div>
      Database Budget IDs:{" "}
      {club.budgetItems.map(item => item.mysqlId).join(", ")}.
    </div>
    <div>
      The Old Budget Site Archive project was an initiative of Club Council
      during the 2022-2023 Academic Year. This document was developed by Club
      Council Representative Galvin Gao '26.
    </div>
    <div>
      Source code of this project is available on GitHub at{" "}
      <OutboundLink
        href="https://github.com/GalvinGao/fandm-club-archive"
        className="!text-inherit whitespace-nowrap text-[12px] inline-flex"
      >
        {/* <a
          href="https://github.com/GalvinGao/fandm-club-archive"
          target="_blank"
          rel="noopener noreferrer"
          className={"font-mono font-semibold text-[12px]"}
        ></a> */}
        https://github.com/GalvinGao/fandm-club-archive
      </OutboundLink>
      .
    </div>
  </code>
)

const VerticalStats: React.FC<{
  items: {
    label: React.ReactNode
    value: React.ReactNode
  }[]
  align?: "left" | "right"
}> = ({ items, align = "left" }) => (
  <table className="tabular-nums">
    <tbody>
      {items.map((item, i) => (
        <tr
          key={i}
          className={clsx("h-6", align === "left" ? "text-left" : "text-right")}
        >
          <td className="text-sm opacity-60 pr-2">{item.label}</td>
          <td className="text-md">
            {item.value === null ||
            item.value === undefined ||
            (typeof item.value === "string" && item.value.trim() === "") ? (
              <span className="opacity-60 font-mono">N/A</span>
            ) : (
              item.value
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)

const ClubBudget: React.FC<{ club: ReturnType<typeof remapClubDataset> }> = ({
  club,
}) => {
  const budgetItems = club.budgetItems.filter(
    item => !(item.aggregation.totalGranted === 0 && item.isBOE)
  )

  if (budgetItems.length === 0) return <p>No budget items found.</p>

  return (
    <section className="mb-8 flex flex-col gap-4">
      {budgetItems.map(item => {
        const name = (() => {
          if (item.type?.id === 5)
            // BOE
            return <span className="opacity-60">Basic Operating Expenses</span>

          if (item.name) return item.name

          return <span className="italic opacity-60">(Unnamed Item)</span>
        })()

        const overviews: {
          label: React.ReactNode
          value: React.ReactNode
        }[] = [
          // { label: "Semester", value: item.semester?.name },
          {
            label: "Created By",
            value: <span className="font-mono">{item.creator}</span>,
          },
          {
            label: "Date/Time Created",
            value: formatTime(item.createdAt),
          },
        ]

        if (!item.isBOE) {
          overviews.unshift({ label: "Type", value: item.type?.name })
          overviews.push(
            { label: "Event Date", value: item.date },
            {
              label: (
                <span className="tracking-tighter">Anticipated Attendees</span>
              ),
              value: item.attendees,
            }
          )
        }

        if (item.sa) {
          overviews.push({
            label: (
              <span className="tracking-tighter">Special Allocation?</span>
            ),
            value: "Yes",
          })
        }

        return (
          <Paper className="gap-4" key={item.mysqlId}>
            <div className="flex items-start justify-between gap-4">
              <h5 className="text-2xl">{name}</h5>

              {item.semester && (
                <span
                  className="text-sm font-semibold px-3 py-2 whitespace-nowrap select-none"
                  style={{
                    background: item.semester.color,
                    color: item.semester.light ? "#fff" : "#000",
                  }}
                >
                  {item.semester.name}
                </span>
              )}
            </div>

            <Section title="Overview" level={3}>
              <VerticalStats align="left" items={overviews} />
            </Section>

            {item.description && (
              <Section title="Description" level={3}>
                <Paragraphs text={item.description} />
              </Section>
            )}

            {item.breakdown.length !== 0 && (
              <Section title="Cost Breakdown" level={3}>
                <table className="w-full table-fixed styled-table tabular-nums font-mono">
                  <thead>
                    <tr className="text-primary">
                      <th className="text-left pl-0">Item</th>
                      <th className="text-right w-32">Est. Cost</th>
                      <th className="text-right w-32">Requested</th>
                      <th className="text-right w-32">Granted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.breakdown.map((row, i) => (
                      <tr key={i}>
                        <td className="text-left border border-l-0">
                          <Paragraphs text={row.name} />
                        </td>
                        <td className="text-right border">
                          {formatCurrency(row.cost)}
                        </td>
                        <td className="text-right border">
                          {formatCurrency(row.requested)}
                        </td>
                        <td className="text-right border border-r-0">
                          {formatCurrency(row.granted)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold">
                      <td className="text-left pl-0">Total</td>
                      <td className="text-right">
                        {formatCurrency(item.aggregation.totalBreakdown)}
                      </td>
                      <td className="text-right">
                        {formatCurrency(item.aggregation.totalRequested)}
                      </td>
                      <td className="text-right">
                        {formatCurrency(item.aggregation.totalGranted)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </Section>
            )}

            {item.status && (
              <Section title="Decision" level={3}>
                <Paragraphs text={item.status} />
              </Section>
            )}
          </Paper>
        )
      })}
    </section>
  )
}

const Tag: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => (
  <span
    className={clsx(
      "text-sm font-semibold px-2 py-1 whitespace-nowrap select-none",
      className
    )}
  >
    {children}
  </span>
)

const ClubPage: React.FC<PageProps<ClubDataProps>> = ({ data }) => {
  const club = remapClubDataset(data)
  const buildTime = new Date().toISOString()

  return (
    <Layout>
      <Alert title="Disclaimer">
        <p>
          The information contained in this record was obtained from the former
          Club Council Budget Site that was operational from 2008 to 2020. It is
          important to note that this data may not accurately reflect the
          current state of the organization, particularly with regard to changes
          in the Advisor, Executive Board and Constitution. The information may
          since been updated by the organization, but the changes have not been
          reflected in this record.
        </p>
        <p className="mt-2">
          Additionally, the <i>Date Added to Site</i> does not necessarily
          reflect the actual date of recognition.
        </p>
        {club.createdAt.startsWith("2021") && (
          <p className="mt-2">
            Although this organization was added to the site in 2021, the
            students never used the site since it was no longer operational.
          </p>
        )}
        {club.mysqlId === 0 && (
          <p className="mt-2">
            This special placeholder club has been deleted from the database and
            hence does not contain any metadata anymore. However, due to
            implementation details of the old Club Council website, their budget
            records were kept after deletion.
          </p>
        )}
      </Alert>

      <h1 className="text-4xl font-bold text-primary flex items-center justify-start gap-4 mb-4">
        <span
          id="club-name"
          className={clsx("tracking-tighter", club.mysqlId === 0 && "italic")}
        >
          {club.name}
        </span>
        <span className="flex items-center translate-y-0.5">
          {club.labels.length !== 0 &&
            club.labels.map((label, i) => (
              <Tag key={i} className={label.className}>
                {label.name}
              </Tag>
            ))}
        </span>
      </h1>

      <Seo title={club.name} />

      {club.mysqlId !== 0 && (
        <MultiColumn columns={3} className="mb-9">
          {/* {club.type && <StatsCard title="Category" value={club.type} />} */}
          {/* {club.clubType && <StatsCard title="Type" value={club.clubType.name} />} */}
          {club.createdAt && (
            <StatsCard
              title="Date Added to Site"
              value={formatTimeShort(club.createdAt)}
              contentClassName="tracking-tight"
            />
          )}
          {club.membersCount && (
            <StatsCard title="Members" value={club.membersCount} />
          )}
          {club.accountNumber && (
            <StatsCard
              contentClassName="font-mono tracking-tighter"
              title="Account Number"
              value={club.accountNumber}
            />
          )}
          {!!club.slug?.trim() && club.slug !== club.name && (
            <StatsCard title="Alternate Name" value={club.slug} />
          )}
        </MultiColumn>
      )}

      {club.description && (
        <Section title="Description">
          <Paragraphs text={club.description} />
        </Section>
      )}

      {club.advisor && (
        <Section title="Advisor">
          <ContactCard netId={club.advisor} />
        </Section>
      )}

      {club.officers.length !== 0 && (
        <Section title="Executive Board" pageChunk>
          <ul className="grid grid-cols-3 gap-4">
            {club.officers.map(officer => (
              <ContactCard
                component="li"
                key={officer.netId + officer.role}
                role={officer.role}
                netId={officer.netId}
              />
            ))}
          </ul>
        </Section>
      )}

      {club.social.length !== 0 && (
        <Section title="Social Media" pageChunk>
          <ul className="grid grid-cols-1 gap-4">
            {club.social.map(social => (
              <li
                className="flex flex-col p-4 border border-solid border-primary"
                key={social.name}
              >
                <h5 className="text-2xl">{social.name}</h5>
                <OutboundLink
                  enableArchiveLink
                  className="mt-2 inline-flex self-start"
                  href={social.url}
                />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Requested & Granted Funds">
        <ClubBudget club={club} />
      </Section>

      {club.constitution && (
        <Section title="Appendix: Constitution" className="break-before-page">
          <Paragraphs text={club.constitution} />
          <div className="mt-8 h-[1px] w-full bg-secondary" />
        </Section>
      )}

      <Footer club={club} buildTime={buildTime} />
    </Layout>
  )
}

export const Head: React.FC<HeadProps> = () => {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="crossorigin"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap"
        rel="stylesheet"
      ></link>
    </>
  )
}

export default ClubPage
