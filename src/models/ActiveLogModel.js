const mongoose = require("mongoose");
const activeLogModel = new mongoose.Schema(
  {
    active_type: {
      type: String,
      enum: ['create', 'update', 'delete'],
      required: [true, 'active_type is required!']
    },
    entity_name: {
      type: String,
      required: [true, 'entity_name is required!']
    },
    entity_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'entity_name is required!']
    },
    action_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
  }
);

const actionLog = mongoose.model("Action_log", activeLogModel);
module.exports = actionLog;
