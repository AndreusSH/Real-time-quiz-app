import mongoose from 'mongoose';

const quizSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answers: [
    {
      answer: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  ],
});

// Add a custom validator to ensure only one answer is marked as true
quizSchema.path('answers').validate(function (answers) {
  let trueCount = 0;
  for (const answer of answers) {
    if (answer.isCorrect) trueCount++;
  }
  return trueCount === 1;
}, 'Exactly one answer must be marked as correct');


const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
