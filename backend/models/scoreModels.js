import mongoose from 'mongoose';

const scoreSchema = mongoose.Schema({
  playerId: {
    type: String,
    required: true,
  },
  score:{
    type:Number,
    required: true
  }
});

 

const Quiz = mongoose.model('Score', scoreSchema);

export default Quiz;
