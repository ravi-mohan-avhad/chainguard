import mongoose, { Schema } from 'mongoose'

const transactionSchema = new Schema({
  date: {
    type: String
  },
  type: {
    type: String
  },
  description: {
    type: String
  },
  status: {
    type: String
  },
  sender: {
    type: String
  },
  receipient: {
    type: String
  },
  hash: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

transactionSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      date: this.date,
      type: this.type,
      description: this.description,
      status: this.status,
      sender: this.sender,
      receipient: this.receipient,
      hash: this.hash,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Transaction', transactionSchema)

export const schema = model.schema
export default model
