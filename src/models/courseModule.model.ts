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
});

const CourseModule = mongoose.model("CourseModule", courseModuleSchema);

export default CourseModule;
