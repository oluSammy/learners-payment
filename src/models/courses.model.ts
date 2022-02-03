import mongoose from "mongoose";

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
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseModule",
  },
  caption: {
    type: String,
    required: String,
  },
  details: [
    {
      id: Number,
      module: {
        type: String,
        required: true,
      },
      caption: {
        type: String,
        required: true,
      },
    },
  ],
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
