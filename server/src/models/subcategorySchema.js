import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const SubcategorySchema = new Schema(
  {
    category: { type: Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true }, 
    image: { type: String },      
    details: { type: String },
    link: { type: String },
  },
  {
    timestamps: true,
  }
);

export default model('Subcategory', SubcategorySchema);
