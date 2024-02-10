import dbConnect from "@/lib/dbConnect"
import { TBQContact } from "../interfaces/BQContact"
import BQContactModel from "@/lib/models/BQContact.model"
import {
  AppContactType,
  AppContactWorkDetailsType,
} from "../interfaces/AppContact"

const labelsToAppContactProps: { [key: string]: keyof AppContactType } = {
  state: "state",
  "Volunteer Type": "volunteer_type",
  "volunteer time": "volunteer_time",
  "location||Location": "parliamentary_constituency",
  "assembly location": "assembly_constituency",
  "Next available to work": "availability",
}

const labelToAppWorkDetailsProps: {
  [key: string]: keyof AppContactWorkDetailsType
} = {
  "Households visited": "houses_visited",
  "Number of voters registered": "voters_enrolled",
  "Enrolment quiz status": "enrollment_quiz_status",
  "volunter quiz status": "volunteer_quiz_status",
}

const _init = async (): Promise<boolean> => {
  try {
    const connection = await dbConnect()
    return connection !== null
  } catch (e) {
    console.error(e)
    return false
  }
}

export const dumpTable = async (): Promise<boolean> => {
  const connection = await _init()

  if (!connection) {
    return false
  }

  try {
    await BQContactModel.deleteMany({}).exec()
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

export const addRow = async (row: TBQContact): Promise<boolean> => {
  const connection = await _init()

  if (!connection) {
    return false
  }

  try {
    const added = await BQContactModel.updateOne({ phone: row.phone }, row, {
      upsert: true,
    }).exec()
    return added.modifiedCount > 0 || added.upsertedCount > 0
  } catch (e) {
    console.error(e)
    return false
  }
}

export const getAllContacts = async (
  state?: string[],
  pc?: string[]
): Promise<{
  contacts: AppContactType[]
  totalContacts: number
}> => {
  const connection = await _init()

  if (!connection) {
    return {
      contacts: [],
      totalContacts: 0,
    }
  }

  const queryObj: { [key: string]: any } = {}

  if (state && state.length > 0) {
    queryObj["fields.label"] = "state"
    queryObj["fields.value"] = { $in: state }
  }

  if (pc && pc.length > 0) {
    queryObj["fields.label"] = { $in: ["location", "Location"] }
    queryObj["fields.value"] = { $in: pc }
  }

  try {
    const contacts = await BQContactModel.find(queryObj)
      .collation({ locale: "en", strength: 2 })
      .exec()
    return {
      contacts: contacts.map((c) => convertContact(c.toJSON())),
      totalContacts: contacts.length,
    }
  } catch (e) {
    console.error(e)
    return {
      contacts: [],
      totalContacts: 0,
    }
  }
}

export const getAllWorkDetails = async (
  state?: string[],
  pc?: string[]
): Promise<{
  workDetails: AppContactWorkDetailsType[]
  totalWorkDetails: number
}> => {
  const connection = await _init()

  if (!connection) {
    return {
      workDetails: [],
      totalWorkDetails: 0,
    }
  }

  const queryObj: { [key: string]: any } = {}

  if (state && state.length > 0) {
    queryObj["fields.label"] = "state"
    queryObj["fields.value"] = { $in: state }
  }

  if (pc && pc.length > 0) {
    queryObj["fields.label"] = { $in: ["location", "Location"] }
    queryObj["fields.value"] = { $in: pc }
  }

  try {
    const contacts = await BQContactModel.find(queryObj)
      .collation({ locale: "en", strength: 2 })
      .exec()
    return {
      workDetails: contacts.map((c) => convertWorkDetails(c.toJSON())),
      totalWorkDetails: contacts.length,
    }
  } catch (e) {
    console.error(e)
    return {
      workDetails: [],
      totalWorkDetails: 0,
    }
  }
}

const convertContact = (contact: TBQContact): AppContactType => {
  const base: AppContactType = {
    volunteer_name: contact.fields.find((f) => f.label === "Name")?.value || "",
    wa_name: contact.name,
    phone: contact.phone,
    language: contact.language,
    optin_method: contact.contact_optin_method,
    optin_time: contact.optin_time?.value || null,
    inserted_at: contact.inserted_at?.value || null,
    last_message_at: contact.last_message_at?.value || null,
    user_name: contact.user_name,
    user_role: contact.user_role,
    max_timestamp: contact.max_timestamp?.value,
  }

  for (const label in labelsToAppContactProps) {
    const prop = labelsToAppContactProps[label]
    ;(base as any)[prop] = contact.fields.find((f) => {
      if (label.includes("||")) {
        const options = label.split("||")
        return options.some((o) => o === f.label)
      }
      return f.label === label
    })?.value
  }

  return base
}

export const getAllStatesFromDB = async (): Promise<
  { _id: any; data: string[] }[]
> => {
  const connection = await _init()

  if (!connection) {
    return []
  }

  try {
    const states = await BQContactModel.aggregate([
      {
        $project: {
          fields: {
            $filter: {
              input: "$fields",
              as: "field",
              cond: {
                $eq: ["$$field.label", "state"],
              },
            },
          },
        },
      },
      {
        $unwind: "$fields",
      },
      {
        $group: {
          _id: undefined,
          data: {
            $addToSet: "$fields.value",
          },
        },
      },
    ]).exec()
    return states
  } catch (e) {
    console.error(e)
    return []
  }
}

export const getAllPCsFromDB = async (): Promise<
  { _id: any; data: string[] }[]
> => {
  const connection = await _init()

  if (!connection) {
    return []
  }

  try {
    const pcs = await BQContactModel.aggregate([
      {
        $project: {
          fields: {
            $filter: {
              input: "$fields",
              as: "field",
              cond: {
                $eq: ["$$field.label", "Location"],
              },
            },
          },
        },
      },
      {
        $unwind: "$fields",
      },
      {
        $group: {
          _id: undefined,
          data: {
            $addToSet: "$fields.value",
          },
        },
      },
    ]).exec()
    return pcs
  } catch (e) {
    console.error(e)
    return []
  }
}

const convertWorkDetails = (contact: TBQContact): AppContactWorkDetailsType => {
  const base: AppContactWorkDetailsType = {
    wa_name: contact.name,
    phone: contact.phone,
  }

  for (const label in labelToAppWorkDetailsProps) {
    const prop = labelToAppWorkDetailsProps[label]
    ;(base as any)[prop] = contact.fields.find((f) => f.label === label)?.value
  }

  return base
}
