// app/models/Report.js
import mongoose, { Schema } from 'mongoose';

const timeSchema = new Schema(
  {
    value: { type: Number },
    time: { type: String },
    systolic: { type: Number },
    diastolic: { type: Number },
    notes: { type: String },
  },
  { _id: false }
);

const reportSchema = new Schema(
  {
    user: {
      type: String,
      enum: ['mom', 'dad'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    morning: {
      bloodSugar: timeSchema,
      bloodPressure: timeSchema,
      medication: { type: String },
      food: { type: String },
      notes: { type: String },
    },
    afternoon: {
      bloodSugar: timeSchema,
      bloodPressure: timeSchema,
      medication: { type: String },
      food: { type: String },
      notes: { type: String },
    },
    evening: {
      bloodSugar: timeSchema,
      bloodPressure: timeSchema,
      medication: { type: String },
      food: { type: String },
      notes: { type: String },
    },
    night: {
      bloodSugar: timeSchema,
      bloodPressure: timeSchema,
      medication: { type: String },
      food: { type: String },
      notes: { type: String },
    },
    dailySummary: {
      weight: { type: Number },
      sleepHours: { type: Number },
      mood: { type: String },
      generalNotes: { type: String },
    }
  },
  { timestamps: true }
);

// Compound index to ensure one document per user per day
reportSchema.index({ user: 1, date: 1 }, { unique: true });

// ✅ Make sure you have default export
export default mongoose.models.Report || mongoose.model('Report', reportSchema);