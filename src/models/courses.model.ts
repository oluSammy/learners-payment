import mongoose from "mongoose";

// Define the schema for the course model
const courseSchema = new mongoose.Schema({
  trainingId: {
    type: String,
    unique: true,
    required: true,
  },
  title: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
