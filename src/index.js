const { LambdaException } = require('./exceptions')
const { hasMentioned } = require('./hasMentioned')
const { redeemReward } = require('./redeemReward')

/**
 * Access headers for CORs.
 *
 * @var {object} headers
 */
const headers = {
  'Access-Control-Allow-Origin': '*',
}

exports.handler = async (event, _, callback) => {
  /**
   * @param {number} statusCode Http statusCode to return
   * @param {string} body Response body
   */
  const respond = (statusCode, body = '') => callback(null, { statusCode, body, headers })

  try {
    /**
     * @var {string} user Users Instagram handle
     *
     * @var {string} promoter Promoter that the user wants to collect a reward for
     */
    const { user, promoter } = event.pathParameters


    /**
     * @var {number|null} checksum Prevents double spending issues
     */
    const checksum = await hasMentioned(user, promoter)

    await redeemReward(user, promoter, checksum)

    respond(200)
  } catch (error) {
    console.log(error)

    return respond(
      error instanceof LambdaException ? error.status : 500,
      error.message,
    )
  }
}
