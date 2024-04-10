const { Schema, model } = require("mongoose");

const sessionSchema = new Schema(
  {
    date_session: { type: Date, default: Date.now },
    type_session: {
      type: String,
      enum: ["Upper A", "Lower", "Upper B", "Other"],
      required: true,
    },
    body_weight: {
      type: Number,
      required: true,
    },
    exercise_user_list: [
      {
        type: Schema.Types.ObjectId,
        ref: "ExerciseUser",
      },
    ],
    is_done: { type: Boolean, default: false },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comment: { type: String, maxLength: 30 },
  },
  {
    timestamps: true,
  }
);

const Session = model("Session", sessionSchema);

module.exports = Session;
