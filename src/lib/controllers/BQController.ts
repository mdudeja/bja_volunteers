import { BigQuery } from "@google-cloud/bigquery"
import cron from "node-cron"
import { dumpTable, addRow } from "@/lib/controllers/ContactsController"
import { TBQContact } from "../interfaces/BQContact"
import { GlobalRef } from "@/lib/GlobalRef"

export default class BQController {
  private _client: BigQuery
  private _activeJobs: string[] = []

  constructor() {
    console.log("BQController Init")
    this._client = new BigQuery()

    if (process.env.NODE_ENV === "production") {
      cron.schedule("0 * * * *", async () => {
        console.log("Running cron job to update Table")
        if (this._activeJobs.length > 0) {
          return
        }

        this._fullUpdate()
      })
    }
  }

  private async _query(query: string): Promise<any> {
    const [job] = await this._client.createQueryJob({
      location: "US",
      useLegacySql: false,
      query,
    })

    if (!job) {
      return
    }

    this._activeJobs.push(job.id as string)

    const [rows] = await job.getQueryResults()

    this._activeJobs = this._activeJobs.filter((id) => id !== job.id)

    return rows
  }

  private async _queryStream({
    query,
    onData,
    onEnd,
  }: {
    query: string
    onData: (row: TBQContact) => void
    onEnd: () => void
  }): Promise<void> {
    console.log("Starting Stream")
    this._activeJobs.push("stream")
    this._client
      .createQueryStream({
        location: "US",
        useLegacySql: false,
        query,
      })
      .on("error", (e) => {
        console.error(e)
        this._activeJobs = this._activeJobs.filter((id) => id !== "stream")
      })
      .on("data", onData)
      .on("end", onEnd)
  }

  private async _fullUpdate(): Promise<void> {
    if (!this._client || this._activeJobs.length > 0) {
      return
    }

    await dumpTable()
    await this.queryContacts()
  }

  private _generateQueryText(state?: string[], pc?: string[]) {
    const where = []

    if ((state && state.length > 0) || (pc && pc.length > 0)) {
      if (state && state.length > 0) {
        where.push(
          `LOWER((SELECT value FROM UNNEST(fields) WHERE label = 'state')) in (${state
            .map((s) => `'${s.toLowerCase()}'`)
            .join(", ")})`
        )
      }

      if (pc && pc.length > 0) {
        where.push(
          `LOWER((SELECT value FROM UNNEST(fields) WHERE label in ('Location', 'location'))) in (${pc
            .map((p) => `'${p.toLowerCase()}'`)
            .join(", ")})`
        )
      }
    }

    const query = `
        SELECT
          *,
          MAX(updated_at) OVER (PARTITION BY phone) as max_timestamp
        FROM
          \`unique-outcome-404409.919667717211.contacts\`
        ${where.length ? "WHERE " + where.join(" AND ") : ""}
        QUALIFY updated_at = max_timestamp
        ORDER BY inserted_at DESC
      `

    return query
  }

  public async queryContacts(
    state?: string[],
    pc?: string[],
    onComplete?: () => void | Promise<void>
  ): Promise<any> {
    if (!this._client || this._activeJobs.length > 0) {
      return
    }

    const query = this._generateQueryText(state, pc)

    return this._queryStream({
      query,
      onData: async (row) => {
        await addRow(row)
      },
      onEnd: async () => {
        console.log("Stream Done")
        this._activeJobs = this._activeJobs.filter((id) => id !== "stream")
        await onComplete?.()
      },
    })
  }
}

const BQControllerRef = new GlobalRef<BQController>("BQController")

if (!BQControllerRef.value) {
  BQControllerRef.value = new BQController()
}

export const BQControllerInstance = BQControllerRef.value
