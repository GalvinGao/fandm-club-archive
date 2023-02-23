import clsx from "clsx"
import linkifyHtml from "linkify-html"
import * as linkify from "linkifyjs"
import * as React from "react"
import { findUserMap } from "../../utils/findUserMap"
import { NetID } from "./model"

export const Section: React.FC<{
  title: string
  children: React.ReactNode
  level?: 2 | 3
  className?: string
  pageChunk?: boolean
}> = ({ title, children, level = 2, className, pageChunk }) => {
  const Component = `h${level}` as keyof JSX.IntrinsicElements
  const textClass = {
    2: "text-2xl font-bold tracking-tighter mb-4",
    3: "text-xl font-semibold tracking-tight mb-2",
  }[level]
  const containerClass = {
    2: "mb-8",
    3: "mb-0",
  }[level]

  return (
    <section
      className={clsx(containerClass, pageChunk && "break-inside-avoid-page")}
    >
      <Component
        className={clsx(
          "text-primary break-after-avoid-page",
          textClass,
          className
        )}
      >
        {title}
      </Component>
      {children}
    </section>
  )
}

export const Alert: React.FC<{
  title: string
  children: React.ReactNode
  className?: string
}> = ({ title, children, className }) => {
  return (
    <section className="mb-6 break-inside-avoid-page border border-solid border-blue-600 bg-blue-100 p-4">
      <div
        className={clsx(
          "text-2xl tracking-tighter text-primary font-bold break-after-avoid-page mb-2",
          className
        )}
      >
        {title}
      </div>
      {children}
    </section>
  )
}

export const MultiColumn: React.FC<{
  children?: React.ReactNode[]
  columns?: number
  className?: string
}> = ({ children, columns, className }) => (
  <div
    className={clsx("grid gap-4", className)}
    style={{
      gridTemplateColumns: `repeat(${
        columns !== undefined ? columns : children?.length
      }, minmax(0, 1fr))`,
    }}
  >
    {children?.filter(Boolean).map((child, i) => (
      <div key={i} className="col-span-1 h-full">
        {child}
      </div>
    ))}
  </div>
)

export const TwoColumn: React.FC<{
  children: [React.ReactNode, React.ReactNode]
}> = ({ children }) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="col-span-1">{children[0]}</div>
    <div className="col-span-1">{children[1]}</div>
  </div>
)

export const ThreeColumn: React.FC<{
  children: [React.ReactNode, React.ReactNode, React.ReactNode]
}> = ({ children }) => (
  <div className="grid grid-cols-3 gap-4">
    <div className="col-span-1">{children[0]}</div>
    <div className="col-span-1">{children[1]}</div>
    <div className="col-span-1">{children[2]}</div>
  </div>
)

export const fixEncoding = (text: string) =>
  text
    .replace(/â€™/g, "'")
    .replace(/â€“/g, "-")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€¦/g, "...")
    .replace(/â€¨/g, " ")
    .replace(/ï¿½/g, " ")
    .replace(/Ã¡'Ã­/g, "á'í")

export const removeFirstOrLastEmptyLine = (lines: string[]) => {
  if (lines.length === 0) {
    return lines
  }
  if (lines[0]?.trim() === "") {
    lines.shift()
  }
  if (lines[lines.length - 1]?.trim() === "") {
    lines.pop()
  }
  return lines
}

export const Paragraphs: React.FC<{ text: string }> = ({ text }) => (
  <div>
    {removeFirstOrLastEmptyLine(text.split("\n"))
      // .filter(el => el.trim() !== "") // remove empty lines
      .map((paragraph, i) => {
        const fixedParagraph = fixEncoding(paragraph)

        return (
          <p
            className="mb-2 last:mb-0 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: linkifyHtml(fixedParagraph, {
                defaultProtocol: "http",
                attributes: {
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
                format: (value, type) => {
                  if (type === "url" && value.startsWith("mailto:")) {
                    return value.replace("mailto:", "")
                  }
                  return value
                },
                validate: {
                  url: value => {
                    if (value.startsWith("mailto:")) {
                      return true
                    }
                    return linkify.test(value)
                  },
                },
                className: {
                  url: "text-sm font-mono",
                },
                // add another link to web.archive.org after the original link
                render: ({ content, tagName, attributes }) => {
                  let attributesText = ""
                  for (const attr in attributes) {
                    attributesText += ` ${attr}=${attributes[attr]}`
                  }
                  const text = `<${tagName} ${attributesText}>${content}</${tagName}>`

                  if (tagName === "a" && attributes.href) {
                    const href = attributes.href
                    if (href.startsWith("mailto:")) {
                      return text
                    }

                    const archiveLink = `https://web.archive.org/web/*/${href}`

                    return `${text} <a href="${archiveLink}" target="_blank" rel="noopener noreferrer" class="text-sm font-mono tracking-tighter">[archived]</a>`
                  }
                  return text
                },
              }),
            }}
          />
        )
      })}
  </div>
)

export interface OutboundLinkProps {
  href: string
  className?: string
  children?: React.ReactNode
  enableArchiveLink?: boolean
}

export const OutboundLink: React.FC<OutboundLinkProps> = ({
  href,
  className,
  children = href,
  enableArchiveLink = false,
}) => {
  const body = (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx("text-sm font-mono font-semibold", className)}
    >
      {children}
    </a>
  )

  if (!enableArchiveLink) {
    return body
  }

  const archiveLink = `https://web.archive.org/web/*/${href}`
  return (
    <span>
      {body}
      <a
        href={archiveLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-mono tracking-tighter ml-1"
      >
        [archived]
      </a>
    </span>
  )
}

export const EmailLink: React.FC<
  { netId: NetID } & Omit<OutboundLinkProps, "href">
> = ({ netId, ...props }) => (
  <OutboundLink href={`mailto:${netId}@fandm.edu`} {...props}>
    <span className="whitespace-nowrap">{netId}</span>
    <span className="whitespace-nowrap">@fandm.edu</span>
  </OutboundLink>
)

export const Paper: React.FC<{
  children: React.ReactNode
  className?: string
  component?: React.ElementType
}> = ({ children, className, component: Component = "div" }) => (
  <Component
    className={clsx(
      "flex flex-col p-4 border border-solid border-primary break-inside-avoid-page",
      className
    )}
  >
    {children}
  </Component>
)

function pluralize(
  count: number | undefined,
  singular: string,
  plural: string
) {
  return count === 1 ? singular : plural
}

export const ContactCard: React.FC<{
  netId: NetID
  role?: string
  component?: React.ElementType
}> = ({ netId, role, component: Component = "div" }) => {
  const user = React.useMemo(() => findUserMap(netId), [netId])

  const name = user ? (
    <span
      title={`${
        user.job && "Job at F&M as of 2023: " + user.job + "\n\n"
      }Name extracted from Google Contacts Directory`}
    >
      {user?.name}
    </span>
  ) : (
    <span className="opacity-60">{netId}</span>
  )

  const userJobs = user?.job.split(",")

  return (
    <Paper component={Component}>
      <div className="grid grid-cols-3 gap-4">
        <div className={!role && user?.job ? "col-span-1" : "col-span-3"}>
          <h5 className="text-2xl">{name}</h5>
          {role ? <h6 className="text-lg">{role}</h6> : null}
          <EmailLink netId={netId} className="mt-2 inline-flex" />
        </div>
        {!role && user?.job ? (
          <div className="flex flex-col items-start col-span-2">
            <h6 className="text-sm font-bold mt-1">
              {pluralize(userJobs?.length, "Role", "Roles")} at F&M as of 2023
              (from directory)
            </h6>
            <ul className="text-sm">
              {userJobs?.map((job, i) => (
                <li key={i}>{job}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Paper>
  )
}

export const StatsCard: React.FC<{
  title: string
  value: React.ReactNode
  caption?: string
  contentClassName?: string
}> = ({ title, value, caption, contentClassName }) => (
  <Paper className="h-full flex flex-col">
    <h5 className="text-lg">{title}</h5>
    <div className="flex-1" />
    <h4
      className={clsx(
        "text-xl font-bold tracking-narrow tabular-nums text-primary",
        contentClassName
      )}
    >
      {value}
    </h4>
    {caption && <p className="text-xs mt-2 text-blue-600">{caption}</p>}
  </Paper>
)
