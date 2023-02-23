import { unescape } from "lodash-es"
import { fixEncoding } from "./foundation"

export type ClubDataProps = {
  mysqlClubs: {
    id: number
    name: string
    descri: string
    intClubType: number
    slug?: string
    desc: string
    welcTitle?: string
    welcText?: string
    url?: string
    facebook?: string
    twitter?: string
    isActive: number
    isRecognized: number
    account_number: string
    board_short: string
    adv_short: string
    members: string
    dues?: string
    calendar: string
    name1_short?: string
    role1?: string
    name2_short?: string
    role2?: string
    name3_short?: string
    role3?: string
    name4_short?: string
    role4?: string
    name5_short?: string
    role5?: string
    name6_short?: string
    role6?: string
    name7_short?: string
    role7?: string
    name8_short?: string
    role8?: string
    name9_short?: string
    role9?: string
    name10_short?: string
    role10?: string
    sub_short: string
    sub_phone: string
    created: string
    constit?: string
    budget_closed: number
    appt_set: number
    no_budget: number
    mysqlId: number
  }
  allMysqlBudgetItems: {
    nodes: {
      id: string
      mysqlId: number
      name: string
      descri: string
      date: string
      semester_id: number
      type_id: number
      club_id: number
      creator: string
      attendees: string
      exp1: string
      cost1: number
      req1: number
      grant1: number
      exp2: string
      cost2: number
      req2: number
      grant2: number
      exp3: string
      cost3: number
      req3: number
      grant3: number
      exp4: string
      cost4: number
      req4: number
      grant4: number
      exp5: string
      cost5: number
      req5: number
      grant5: number
      total: number
      request_total: number
      grant_total: number
      status: string
      created: string
      sa: string
    }[]
  }
}

interface ClubType {
  id: number
  name: string
}

const clubTypes: ClubType[] = [
  { id: 0, name: "Untyped" },
  { id: 1, name: "Council Funded" },
  { id: 2, name: "Department Funded" },
  { id: 3, name: "Currently Inactive" },
  { id: 4, name: "Not Recognized" },
  { id: 5, name: "Club Sport" },
  { id: 6, name: "Not a Club" },
  { id: 7, name: "Alumni Funded" },
]
const unknownClubType: ClubType = { id: -1, name: "Unknown" }

declare const brand: unique symbol
type Brand<T, B extends symbol> = T & { [brand]: B }
export type NetID = Brand<string, typeof brand>

const officerSortOrder = [
  "President",
  "Vice President",
  "Treasurer",
  "Secretary",
]

const removeHTML = (html?: string) => html?.replace(/<[^>]*>?/gm, "")

const cleanHTMLEntityEncoding = (html?: string) =>
  unescape(unescape(unescape(html))).replace(/\&nbsp\;/g, " ")

const addScheme = (url: string, domain?: string) => {
  if (url.startsWith("http")) return url
  if (url.startsWith("@") && domain) return `https://${domain}/${url.slice(1)}`
  return `http://${url}`
}

export const remapClubDataset = ({
  mysqlClubs: club,
  allMysqlBudgetItems: budgetItems,
}: ClubDataProps) => ({
  id: club.id,
  mysqlId: club.mysqlId,
  createdAt: club.created,
  name: fixEncoding(club.name),
  labels: (() => {
    const labels: {
      name: string
      className?: string
    }[] = []
    if (club.desc && club.desc !== "Club Council")
      labels.push({ name: club.desc, className: "bg-primary text-white" })

    if (club.mysqlId === 0)
      labels.push({ name: "Placeholder", className: "bg-red-400 text-white" })
    return labels
  })(),
  description: club.descri,
  clubType:
    clubTypes.find(type => type.id === club.intClubType) || unknownClubType,
  slug: club.slug,
  welcome: (() => {
    if (!club.welcTitle || !club.welcText) return null
    return {
      title: club.welcTitle,
      text: club.welcText,
    }
  })(),
  // social: {
  //   url: club.url,
  //   facebook: club.facebook,
  //   twitter: club.twitter,
  // }
  social: (() => {
    const socials: { name: string; url: string }[] = []
    if (club.url) socials.push({ name: "Website", url: addScheme(club.url) })
    if (club.facebook)
      socials.push({
        name: "Facebook",
        url: addScheme(club.facebook, "facebook.com"),
      })
    if (club.twitter)
      socials.push({
        name: "Twitter",
        url: addScheme(club.twitter, "twitter.com"),
      })
    return socials
  })(),
  status: {
    isActive: club.isActive === 1,
    isRecognized: club.isRecognized === 1,
  },
  accountNumber: club.account_number,
  ccRepresentative: club.board_short as NetID,
  advisor: club.adv_short as NetID,
  membersCount: club.members,
  dues: club.dues,
  calendar: club.calendar,
  officers: (() => {
    const officers: { netId: NetID; role: string }[] = []
    if (club.name1_short && club.role1)
      officers.push({ netId: club.name1_short as NetID, role: club.role1 })
    if (club.name2_short && club.role2)
      officers.push({ netId: club.name2_short as NetID, role: club.role2 })
    if (club.name3_short && club.role3)
      officers.push({ netId: club.name3_short as NetID, role: club.role3 })
    if (club.name4_short && club.role4)
      officers.push({ netId: club.name4_short as NetID, role: club.role4 })
    if (club.name5_short && club.role5)
      officers.push({ netId: club.name5_short as NetID, role: club.role5 })
    if (club.name6_short && club.role6)
      officers.push({ netId: club.name6_short as NetID, role: club.role6 })
    if (club.name7_short && club.role7)
      officers.push({ netId: club.name7_short as NetID, role: club.role7 })
    if (club.name8_short && club.role8)
      officers.push({ netId: club.name8_short as NetID, role: club.role8 })
    if (club.name9_short && club.role9)
      officers.push({ netId: club.name9_short as NetID, role: club.role9 })
    if (club.name10_short && club.role10)
      officers.push({ netId: club.name10_short as NetID, role: club.role10 })

    // sort officers by role; officerSortOrder is the order we want.
    // if an officer's role is not in officerSortOrder, it will be appended to the end of the list, where those officers will be sorted alphabetically by their role name
    officers.sort((a, b) => {
      const aIndex = officerSortOrder.indexOf(a.role)
      const bIndex = officerSortOrder.indexOf(b.role)
      if (aIndex === -1 && bIndex === -1) {
        return a.role.localeCompare(b.role)
      } else if (aIndex === -1) {
        return 1
      } else if (bIndex === -1) {
        return -1
      } else {
        return aIndex - bIndex
      }
    })
    return officers
  })(),
  sub: {
    name: club.sub_short as NetID,
    phone: club.sub_phone,
  },
  constitution: cleanHTMLEntityEncoding(removeHTML(club.constit)),
  budgetClosed: club.budget_closed === 1,
  apptSet: club.appt_set === 1,
  noBudget: club.no_budget === 1,
  budgetItems: budgetItems.nodes
    .map(budgetItem => remapBudgetItem(budgetItem))
    .sort((a, b) => a.mysqlId - b.mysqlId),
})

type Semester = {
  id: number
  name: string
  color: string
  light?: boolean
}
const yellow = "#eab308"
const semesters: Semester[] = [
  { id: 2, name: "Fall 2008", color: yellow },
  { id: 4, name: "Fall 2009", color: yellow },
  { id: 6, name: "Fall 2010", color: yellow },
  { id: 8, name: "Fall 2011", color: yellow },
  { id: 10, name: "Fall 2012", color: yellow },
  { id: 12, name: "Fall 2013", color: yellow },
  { id: 14, name: "Fall 2014", color: yellow },
  { id: 16, name: "Fall 2015", color: yellow },
  { id: 21, name: "Fall 2016", color: yellow },
  { id: 23, name: "Fall 2017", color: yellow },
  { id: 25, name: "Fall 2018", color: yellow },
  { id: 27, name: "Fall 2019", color: yellow },
  { id: 1, name: "Spring 2008", color: "#1e40af", light: true },
  { id: 3, name: "Spring 2009", color: "#1e40af", light: true },
  { id: 5, name: "Spring 2010", color: "#1e40af", light: true },
  { id: 7, name: "Spring 2011", color: "#1e40af", light: true },
  { id: 9, name: "Spring 2012", color: "#1e40af", light: true },
  { id: 11, name: "Spring 2013", color: "#1e40af", light: true },
  { id: 13, name: "Spring 2014", color: "#1e40af", light: true },
  { id: 15, name: "Spring 2015", color: "#1e40af", light: true },
  { id: 20, name: "Spring 2016", color: "#1e40af", light: true },
  { id: 22, name: "Spring 2017", color: "#1e40af", light: true },
  { id: 24, name: "Spring 2018", color: "#1e40af", light: true },
  { id: 26, name: "Spring 2019", color: "#1e40af", light: true },
]

type RequestType = {
  id: number
  name: string
}
// 1	General Budget Request
// 2	Event Budget Request
// 3	Trip Budget Request
// 4	Speaker Budget Request
// 5	Basic Operating Expenses
const requestTypes: RequestType[] = [
  { id: 1, name: "General Budget Request" },
  { id: 2, name: "Event Budget Request" },
  { id: 3, name: "Trip Budget Request" },
  { id: 4, name: "Speaker Budget Request" },
  { id: 5, name: "Basic Operating Expenses" },
]

const remapBudgetItem = (
  budgetItem: ClubDataProps["allMysqlBudgetItems"]["nodes"][number]
) => {
  const requestType = requestTypes.find(t => t.id === budgetItem.type_id)

  return {
    id: budgetItem.id,
    mysqlId: budgetItem.mysqlId,
    createdAt: budgetItem.created,
    name: budgetItem.name,
    description: budgetItem.descri,
    date: budgetItem.date,
    semester: semesters.find(s => s.id === budgetItem.semester_id),
    type: requestType,
    isBOE: requestType?.id === 5, // BOE
    creator: budgetItem.creator.toLowerCase() as NetID,
    attendees: budgetItem.attendees,
    aggregation: {
      totalBreakdown: budgetItem.total,
      totalRequested: budgetItem.request_total,
      totalGranted:
        requestType?.id === 5 // BOE
          ? budgetItem.total // automatically granted BOE
          : budgetItem.grant_total,
    },
    breakdown: (() => {
      const breakdowns: {
        name: string
        cost: number
        requested: number
        granted: number
      }[] = []
      if (budgetItem.exp1?.trim()) {
        breakdowns.push({
          name: budgetItem.exp1,
          cost: budgetItem.cost1,
          requested: budgetItem.req1,
          granted: budgetItem.grant1,
        })
      }
      if (budgetItem.exp2?.trim()) {
        breakdowns.push({
          name: budgetItem.exp2,
          cost: budgetItem.cost2,
          requested: budgetItem.req2,
          granted: budgetItem.grant2,
        })
      }
      if (budgetItem.exp3?.trim()) {
        breakdowns.push({
          name: budgetItem.exp3,
          cost: budgetItem.cost3,
          requested: budgetItem.req3,
          granted: budgetItem.grant3,
        })
      }
      if (budgetItem.exp4?.trim()) {
        breakdowns.push({
          name: budgetItem.exp4,
          cost: budgetItem.cost4,
          requested: budgetItem.req4,
          granted: budgetItem.grant4,
        })
      }
      if (budgetItem.exp5?.trim()) {
        breakdowns.push({
          name: budgetItem.exp5,
          cost: budgetItem.cost5,
          requested: budgetItem.req5,
          granted: budgetItem.grant5,
        })
      }

      return breakdowns
    })(),
    status: budgetItem.status,
    sa: budgetItem.sa,
  }
}
