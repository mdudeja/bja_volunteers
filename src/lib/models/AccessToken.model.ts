import mongoose from "mongoose"
import { TAccessToken } from "../interfaces/AccessToken"

const AccessTokenSchema = new mongoose.Schema<TAccessToken>({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  access_type: {
    type: String,
    enum: ["state", "pc"],
    required: true,
  },
  scope: {
    type: [String],
    default: [],
  },
  created_at: {
    type: Date,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
})

AccessTokenSchema.index(
  { token: 1, access_type: 1, scope: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
)

export default mongoose.models.AccessToken ||
  mongoose.model<TAccessToken>("AccessToken", AccessTokenSchema)
