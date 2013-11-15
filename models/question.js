var mongoose = require('mongoose')
  , Schema = mongoose.Schema

/**
 * Question/Answer Schema
 */


var AnswerSchema = new Schema({
  // question: { type: Schema.Types.ObjectId, ref: 'Question' },
  answer: { type: String, default: '' },
  answered: [{ type: Schema.Types.ObjectId, ref: 'User' }],
})

mongoose.model('Answer', AnswerSchema)

var QuestionSchema = new Schema({
  authorId: { type: Schema.Types.ObjectId, ref: 'User' },
  question: { type: String, default: '' },
  answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
  tags: [{ type: String, default: '' }],
  multiple: Boolean,
  comments: [{
    body:{ type: String, default: ''},
    user:{ type: Schema.Types.ObjectId, ref: 'User'},
    created:{ type: Date, default: Date.now},
  }],
  created: { type: Date, default: Date.now },
  answered: [{ type: Schema.Types.ObjectId, ref:'User'}],
  askedTo: [{ type: Schema.Types.ObjectId, ref:'User'}]
})

QuestionSchema.statics = {

  /**
   * Find article by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email username')
      .populate('comments.user')
      .exec(cb)
  },

  /**
   * List questions
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('user', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}



mongoose.model('Question', QuestionSchema)

