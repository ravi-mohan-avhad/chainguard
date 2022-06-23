import mongoose, { Schema } from 'mongoose'

const partySchema = new Schema({
  partyname: {
    type: String
  },
  riskscore: {
    type: String
  },
  status: {
    type: String
  },
  conflictcount: {
    type: String
  },
  linkedaccount: {
    type: String
  },
  address: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

partySchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      partyname: this.partyname,
      riskscore: this.riskscore,
      status: this.status,
      conflictcount: this.conflictcount,
      linkedaccount: this.linkedaccount,
      address: this.address,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Party', partySchema)

export const schema = model.schema
export default model
