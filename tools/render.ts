import pLimit from "p-limit"
import { chromium } from "playwright"

const INDEX_PAGE = "http://localhost:3000"
const limit = pLimit(6)

async function renderPageToPDF(url: string) {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(url)

  // wait for all images to load
  await page.waitForSelector("img", { state: "attached" })

  // get #club-name
  const clubName = await page.$eval(
    "#club-name",
    el => el.textContent?.trim() || ""
  )
  // clean clubName so it can be used as a filename
  const cleanClubName =
    "/Old Budget Site Archive — " + clubName.replace(/\/|:|\?/g, "-")

  const path = cleanClubName ?? new URL(url).pathname.replace(/\/$/, "")
  await page.pdf({
    path: `./output${path}.pdf`,
    format: "Letter",
    printBackground: true,
    displayHeaderFooter: true,
    margin: {
      top: "36px",
      bottom: "48px",
    },
    headerTemplate: "&nbsp;",
    footerTemplate: `<div style="display: flex; align-items: center; width: 100%; padding: 0 24px;font-family: apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif !important; ">
      <div style="text-align: left; font-size: 8px; color: #999;">
        ${clubName}
      </div>

      <div style="flex: 1; text-align: center; font-size: 8px; color: #999;">

      <div style="font-size: 8px; color: #999; text-align: right">
        Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>
      </div>
    `,
  })

  console.log(`Rendered ./output${path}.pdf`)
}

const renderProd = async () => {
  const browser = await chromium.launch() // Or 'firefox' or 'webkit'.
  const page = await browser.newPage()
  await page.goto(INDEX_PAGE)
  // get all links
  const links = await page.$$eval("a", as => as.map(a => a.href))
  // filter out external links
  const internalLinks = links.filter(
    link => link.startsWith(INDEX_PAGE) && link !== INDEX_PAGE
  )

  // loop over internal links
  await browser.close()

  await Promise.all(
    internalLinks.map(link => limit(() => renderPageToPDF(link)))
  )
}

const renderDev = async () => {
  const clubsToRender = [69, 8]
  for (const clubId of clubsToRender) {
    await renderPageToPDF(`http://localhost:8000/clubs/${clubId}`)
  }
}

async function main() {
  const isDev = process.argv.includes("--dev")
  if (isDev) {
    await renderDev()
  } else {
    await renderProd()
  }
}

main()
  .then(() => console.log("Done"))
  .catch(e => console.error(e))
  .finally(() => process.exit())
