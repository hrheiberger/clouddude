const mongoose = require("mongoose");

const LevelSchema = new mongoose.Schema({
  // _id : String
  creator: String,
  name: String,
  start: { x: Number, y: Number },
  exit: { x: Number, y: Number },
  platforms: [{ image: String, x: Number, y: Number }],
  decoration: [{ frame: Number, x: Number, y: Number }],
  coins: [{ x: Number, y: Number }],
  obstacles: [{ type: String, x: Number, y: Number }],
  funness: Number,
  difficulty: Number,
});

// compile model from schema
module.exports = mongoose.model("level", LevelSchema);
