import dayjs from "dayjs"

import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { indicator } from "ordinal"

dayjs.extend(utc)
dayjs.extend(timezone)

export const formatTime = (time: string) => {
  // return 2023-02-15 16:23:45 PM +08, in America/New_York timezone
  const inst = dayjs(time).tz("America/New_York")
  return `${inst.format("MMM D")}, ${inst.year()} (${inst.format("h:mm A")})`
}

export const formatTimeShort = (time: string) => {
  // return "December 29th, 2023", in America/New_York timezone
  const inst = dayjs(time).tz("America/New_York")
  return `${inst.format("MMMM D")}${indicator(inst.date())}, ${inst.year()}`
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}
