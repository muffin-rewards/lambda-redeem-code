const AWS = require('aws-sdk')
const { RewardRedeemedException } = require('./exceptions')

/**
 * DynamoDB instance.
 *
 * @var {DynamoDB} ddb
 */
const ddb = new AWS.DynamoDB()

/**
 * Redeems a reward from given promoter if checksum matches redeemedAt.
 *
 * @param {string} user
 * @param {string} promoter
 * @param {number|null} checksum
 */
exports.redeemReward = async (user, promoter, checksum) => {
  const response = await ddb.updateItem({
    TableName: process.env.MENTIONS_TABLE,
    Key: {
      user: { S: user },
      promoter: { S: promoter },
    },
    UpdateExpression: 'SET #at = :b',
    ExpressionAttributeNames: {
      '#at': 'redeemedAt',
    },
    ExpressionAttributeValues: {
      ':b': { NUMBER: Date.now() },
    },
    ReturnValues: 'ALL_OLD'
  }).promise()

  console.log('hasMentionedResponse', response, checksum)
}
