import dbConnect from "@/lib/dbConnect"
import AccessTokenModel from "@/lib/models/AccessToken.model"
import { v4 as uuidv4 } from "uuid"
import { TAccessToken } from "../interfaces/AccessToken"

const _init = async (): Promise<boolean> => {
  try {
    const connection = await dbConnect()
    return connection !== null
  } catch (e) {
    console.error(e)
    return false
  }
}

export const fetchOrGenerateToken = async (
  access_type: "state" | "pc",
  scope: string[] = []
): Promise<TAccessToken | undefined> => {
  const connection = await _init()

  if (!connection) {
    return
  }

  try {
    const token = uuidv4()
    const created_at = Date.now()
    const tokenDoc = await AccessTokenModel.findOne({
      access_type,
      scope: scope.sort(),
    }).exec()

    if (tokenDoc) {
      return tokenDoc.toJSON()
    }

    const newToken = new AccessTokenModel({
      token,
      access_type,
      scope,
      created_at,
    })
    await newToken.save()
    return newToken.toJSON()
  } catch (e) {
    console.error(e)
  }
}

export const deactivateToken = async (token: string): Promise<boolean> => {
  const connection = await _init()

  if (!connection) {
    return false
  }

  try {
    const tokenDoc = await AccessTokenModel.findOne({ token }).exec()
    if (!tokenDoc) {
      return false
    }
    tokenDoc.is_active = false
    await tokenDoc.save()
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

export const fetchToken = async (
  token: string
): Promise<TAccessToken | undefined> => {
  const connection = await _init()

  if (!connection) {
    return
  }

  try {
    const tokenDoc = await AccessTokenModel.findOne({ token }).exec()
    if (!tokenDoc) {
      return
    }
    return tokenDoc.toJSON()
  } catch (e) {
    console.error(e)
  }
}

export const fetchAllTokens = async (): Promise<TAccessToken[] | undefined> => {
  const connection = await _init()

  if (!connection) {
    return
  }

  try {
    const tokens = await AccessTokenModel.find().exec()
    return tokens.map((token) => ({ ...token.toJSON(), _id: undefined }))
  } catch (e) {
    console.error(e)
  }
}

export const deleteToken = async (token: string): Promise<boolean> => {
  const connection = await _init()

  if (!connection) {
    return false
  }

  try {
    const tokenDoc = await AccessTokenModel.deleteOne({ token }).exec()
    return tokenDoc.deletedCount === 1
  } catch (e) {
    console.error(e)
    return false
  }
}
