import mongoose, { Schema } from 'mongoose'

const issueSchema = new Schema({
  date: {
    type: String
  },
  party: {
    type: String
  },
  address: {
    type: String
  },
  description: {
    type: String
  },
  reportedby: {
    type: String
  },
  riskscore: {
    type: String
  },
  validitystatus: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

issueSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      date: this.date,
      party: this.party,
      address: this.address,
      description: this.description,
      reportedby: this.reportedby,
      riskscore: this.riskscore,
      validitystatus: this.validitystatus,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Issue', issueSchema)

export const schema = model.schema
export default model
