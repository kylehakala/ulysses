'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ConstraintSchema = new mongoose.Schema({
  start: Date,
  end: Date,
  name: String
});

//testing stuff
var VolunteerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  lastEmail: String,
  username: String,
  password: String,
  childTeam: String,
  comments: String,
  shirt: String,
  positions: Array,
  preferences: Array,
  isJudge: Boolean,
  constraints: [ConstraintSchema]
});

var SlotSchema = new mongoose.Schema({
  assigned: [VolunteerSchema],
  positions: Number,
  start: Date,
  end: Date,
  slotComments: String,
  slotCommentsBoolean: Boolean
});

var JobSchema = new mongoose.Schema({
  name: String,
  training: Number,
  isJudging: Boolean,
  slots: [SlotSchema],
  jobComments: String
});

var ProblemSchema = new mongoose.Schema({
  problem: String,
  division: String,
  longterm: String,
  spontaneous: String
});

var TeamSchema = new mongoose.Schema({
  number: String,
  problems: [ProblemSchema]
});

var ConflictSchema = new mongoose.Schema({
  desc: String,
  start: Date,
  end: Date,
  name: String
});

var ScheduleSchema = new mongoose.Schema({
  name: String,
  date: Date,
  info: String,
  constraintUpload: [ConflictSchema],
  emailAll: String,
  jobs: [JobSchema],
  teams: [TeamSchema],
  unassigned: [VolunteerSchema]
});


export default mongoose.model('Schedule', ScheduleSchema);
