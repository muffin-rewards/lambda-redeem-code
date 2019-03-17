
class LambdaException extends Error {

  /**
   * @param {number} status Http status
   * @param {string} body Body to yield with the response
   */
  constructor (status, body) {
    super(body)
    this.status = status
  }

}

exports.LambdaException = LambdaException

exports.MentionNotFoundException = class MentionNotFoundException extends LambdaException {

  /**
   * @constructor
   */
  constructor () {
    super(404, 'MentionNotFound')
  }

}

exports.RewardRedeemedException = class RewardRedeemedException extends LambdaException {

  /**
   * @constructor
   */
  constructor () {
    super(406, 'RewardAlreadyRedeemed')
  }

}
