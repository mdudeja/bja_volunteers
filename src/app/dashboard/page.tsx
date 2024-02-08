import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import getVolunteerData from "../actions/getVolunteerData"
import DashboardVolunteersView from "@/components/DashboardVolunteersView"
import GenerateLinksComponent from "@/components/GenerateLinksComponent"
import getExistingLinks from "@/app/actions/getExistingLinks"
import { getSession } from "@/lib/getSession"
import { SessionData } from "@/lib/interfaces/SessionData"
import SummaryComponent from "@/components/SummaryComponent"
import getWorkDetailsData from "@/app/actions/getWorkDetailsData"
import WorkDetailsComponent from "@/components/WorkDetailsComponent"
import { work_details_table_headers } from "@/lib/Constants"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Metadata, ResolvingMetadata } from "next"
import verifyToken from "@/app/actions/verifyToken"

async function getContacts(user: SessionData["user"]) {
  if (user?.type === "admin") {
    return await getVolunteerData()
  }

  return await getVolunteerData(user?.access?.states, user?.access?.pcs)
}

async function getWorkDetails(user: SessionData["user"]) {
  if (user?.type === "admin") {
    return await getWorkDetailsData()
  }

  return await getWorkDetailsData(user?.access?.states, user?.access?.pcs)
}

export default async function DashboardPage() {
  const session = await getSession()
  const existingTokens =
    session?.user?.type === "admin" ? await getExistingLinks() : []
  const { contacts, totalContacts: _ } = await getContacts(session?.user)
  const { workDetails, totalWorkDetails: __ } = await getWorkDetails(
    session?.user
  )

  return (
    <div className="height-minus-topbar">
      <ResizablePanelGroup className="" direction="vertical">
        <ResizablePanel defaultSize={40}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={60}>
              {session?.user?.type === "admin" && (
                <GenerateLinksComponent data={existingTokens} minified={true} />
              )}
              {session?.user?.type !== "admin" && (
                <div className="h-full flex flex-col space-y-2 pb-2">
                  <p className="text-lg mx-4 mt-2 underline underline-offset-4">
                    Work Details
                  </p>
                  <WorkDetailsComponent
                    data={workDetails}
                    tableHeaders={work_details_table_headers}
                    currentPage={1}
                    rowsPerPage={10}
                    minified={true}
                  />
                  <Button className="self-end me-2">
                    <Link href="/work-details">View All</Link>
                  </Button>
                </div>
              )}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40}>
              <SummaryComponent data={contacts} minified={true} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60}>
          <p className="text-lg mx-4 mt-2 underline underline-offset-4">
            Volunteers
          </p>
          <DashboardVolunteersView contacts={contacts} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? ""),
    title: "BJA Volunteers",
    description: "Volunteer management for the BJA",
    icons: {
      icon: `/images/logo_filled.jpg`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_URL}/`,
      title: "BJA Volunteers",
      description: "Volunteer management for the BJA",
      images: [
        {
          url: `/images/logo_filled.jpg`,
          width: 400,
          height: 400,
          alt: "BJA Volunteers",
        },
      ],
    },
  }

  if (!searchParams) {
    return metadata
  }

  const token = searchParams?.token as string

  const tokenDetails = await verifyToken(token)

  if (tokenDetails?._id) {
    if (tokenDetails.type === "user") {
      if (tokenDetails.access.states.length > 0) {
        metadata.title =
          tokenDetails.access.states.join(", ") + " BJA Volunteers"
        metadata.description = `Volunteer management for the BJA in ${tokenDetails.access.states.join(
          ", "
        )}`
      }

      if (tokenDetails.access.pcs.length > 0) {
        metadata.title = tokenDetails.access.pcs.join(", ") + " BJA Volunteers"
        metadata.description = `Volunteer management for the BJA in ${tokenDetails.access.pcs.join(
          ", "
        )}`
      }

      if (metadata.openGraph) {
        metadata.openGraph.title = metadata.title as string
        metadata.openGraph.description = metadata.description as string
      }
    }
  }

  return metadata
}
