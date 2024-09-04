import mongoose, { Schema } from "mongoose";
import { IPeople } from "./peopleModel";

const peopleSchema = new Schema<IPeople>({
  username: {
    type: String,
    required: [true, "username is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  role: {
    type: String,
    required: [true, "role is required"],
  },
});

// mongoose.model("model name", schema, "collection name" (optional)
// (if not provided, mongoose will use the plural of the model name))
const People = mongoose.model<IPeople>("People", peopleSchema);

export default People;
