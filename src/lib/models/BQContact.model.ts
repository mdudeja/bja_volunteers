import mongoose from "mongoose"
import { TBQContact } from "../interfaces/BQContact"

const BQContactSchema = new mongoose.Schema<TBQContact>({
  id: {
    type: Number,
    required: true,
  },
  bq_uuid: {
    type: mongoose.Schema.Types.UUID,
    default: null,
  },
  bq_inserted_at: {
    value: {
      type: Date,
      default: null,
    },
  },
  name: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    required: true,
    match: /^\d{12}$/,
  },
  provider_status: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: null,
  },
  contact_optin_method: {
    type: String,
    default: null,
  },
  optin_time: {
    value: {
      type: Date,
      default: null,
    },
  },
  optout_time: {
    value: {
      type: Date,
      default: null,
    },
  },
  last_message_at: {
    value: {
      type: Date,
      default: null,
    },
  },
  inserted_at: {
    value: {
      type: Date,
      default: null,
    },
  },
  updated_at: {
    value: {
      type: Date,
      default: null,
    },
  },
  user_name: {
    type: String,
    default: null,
  },
  user_role: {
    type: String,
    default: null,
  },
  fields: [
    {
      label: {
        type: String,
        default: null,
      },
      value: {
        type: String,
        default: null,
      },
      type: {
        type: String,
        default: null,
      },
      inserted_at: {
        value: {
          type: Date,
          default: null,
        },
      },
    },
  ],
  settings: {
    type: {
      label: {
        type: String,
        default: null,
      },
      values: [
        {
          key: {
            type: String,
            default: null,
          },
          value: {
            type: String,
            default: null,
          },
        },
      ],
    },
    default: null,
  },
  groups: [
    {
      label: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        default: null,
      },
    },
  ],
  tags: [
    {
      label: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        default: null,
      },
    },
  ],
  raw_fields: {
    type: String,
    default: null,
  },
  group_labels: {
    type: String,
    default: null,
  },
  max_timestamp: {
    value: {
      type: Date,
    },
  },
})

BQContactSchema.index(
  { phone: 1, name: 1, fields: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
)

export default mongoose.models.BQContact ||
  mongoose.model<TBQContact>("BQContact", BQContactSchema)
