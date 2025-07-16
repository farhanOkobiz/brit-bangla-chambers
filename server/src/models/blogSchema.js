import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const BlogSchema = new Schema(
  {
    author_id: { type: Types.ObjectId, required: true, refPath: 'author_model' },
    author_model: { type: String, required: true, enum: ['Admin', 'Advocate'] },

    title: { type: String, required: true },

    slug: { type: String, required: true, unique: true },

    content: { type: String, required: true },

    tags: [{ type: String }],

    published_at: { type: Date,
      default: Date.now,
      required: true,
     },

    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

export default model('Blog', BlogSchema);
