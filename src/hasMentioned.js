const AWS = require('aws-sdk')
const { MentionNotFoundException, RewardRedeemedException } = require('./exceptions')

/**
 * @var {number} redemptionDelay How many days user has to wait before redeeming again
 */
const redemptionDelay = Number(process.env.REDEMPTION_DELAY) * 86400

/**
 * DynamoDB instance.
 *
 * @var {DynamoDB} ddb
 */
const ddb = new AWS.DynamoDB()

/**
 * Checks if a user has already redeemed a reward with a promoter.
 *
 * @param {string} user User that mentioned a promoter
 * @param {string} promoter Mentioned IG client
 * @return {number|null} Checksum for updating redeemedAt
 */
exports.hasMentioned = async (user, promoter) => {
  /**
   * Gets all items matching given search key.
   */
  const { Items } = await ddb.query({
    TableName: process.env.MENTIONS_TABLE,
    ExpressionAttributeValues: {
      ':user': { S: user },
      ':promoter': { S: promoter },
    },
    ExpressionAttributeNames:{
      '#u': 'user',
      '#p': 'promoter',
    },
    KeyConditionExpression: '#u = :user AND #p = :promoter',
  }).promise()

  if (!Items || !Items.length) {
    throw new MentionNotFoundException()
  }

  /**
   * DynamoDB row.
   */
  const mention = Items.pop()

  /**
   * When did the user last redeem a reward from the promoter.
   */
  const lastUsed = mention.redeemedAt ? mention.redeemedAt.N : null

  // If never, they can redeem it.
  if (lastUsed === null) {
    return lastUsed
  }

  // Else if the user have waited long enough to be able to redeem again.
  if (Date.now() >= Number(lastUsed) + redemptionDelay) {
    return lastUsed
  }

  throw new RewardRedeemedException
}
