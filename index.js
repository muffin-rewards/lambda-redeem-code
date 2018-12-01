const AWS = require('aws-sdk')
const ddb = new AWS.DynamoDB()

exports.handler = (event, _, callback) => {
  return Promise.resolve(event.body)
    .then(JSON.parse)
    .then(({ code }) => {
      return ddb.query({
        TableName: process.env.DDB_TABLE,
        KeyConditionExpression: 'id = :code',
        ExpressionAttributeValues: {
          ':code': { S: code }
        }
      }).promise()
    })
    .then(({ Items }) => {
      if (!Items || !Items.length) {
        throw { status: 404, message: 'CodeNotFound' }
      }

      const code = Items.filter(item => item.used.BOOL === false).pop()

      if (!code) {
        throw { status: 406, message: 'CodeAlreadyRedeem' }
      }

      return code.id.S
    })
    .then((id) => {
      return ddb.updateItem({
        TableName: process.env.DDB_TABLE,
        Key: { id: { S: id } },
        UpdateExpression: 'SET #used = :b',
        ExpressionAttributeNames: {
          '#used': 'used'
         },
         ExpressionAttributeValues: {
          ':b': { BOOL: true }
         },
      }).promise()
    })
    .then(() => ({ status: 200, body: '' }))
    .catch((error = {}) => {
      return {
        status: error.status || 500,
        body: {
          status: error.status || 500,
          message: error.message || 'InternalServerError'
        }
      }
    })
    .then(({ status, body }) => callback(null, {
      statusCode: status,
      body: JSON.stringify(body),
      headers: { 'Access-Control-Allow-Origin': '*' }
    }))
}
