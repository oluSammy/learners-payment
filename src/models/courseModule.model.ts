import mongoose from "mongoose";

const courseModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  trainings: {
    type: [String],
    required: true,
  },
  objectives: {
    type: [String],
    required: true,
  },
});

const CourseModule = mongoose.model("CourseModule", courseModuleSchema);

export default CourseModule;
