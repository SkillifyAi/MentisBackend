import mongoose from "mongoose";
const { Schema } = mongoose;

// Create the schema for Therapist
const therapistSchema = new Schema({
  firstName: { type: String, required: true },
  userId: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  location: { type: String, required: false },
  bio: { type: String, required: false },
  yearsOfExperience: { type: String, required: false },
  hourlyRate: { type: String, required: false },
  languages: { type: [String], default: [] },
  newLanguage: { type: String, required: false },
  qualifications: { type: String, required: false },
  plan: {type: String, default: "Free"},
  licenseNumber: { type: String, required: false },
  specialization: { type: [String], default: [] },
  availability: {
    monday: { type: Boolean, default: false },
    tuesday: { type: Boolean, default: false },
    wednesday: { type: Boolean, default: false },
    thursday: { type: Boolean, default: false },
    friday: { type: Boolean, default: false },
    saturday: { type: Boolean, default: false },
    sunday: { type: Boolean, default: false }
  },
  timeSlots: { type: [String], default: [] }
}, { timestamps: true });

const Therapist = mongoose.model('Therapist', therapistSchema);

export default Therapist
