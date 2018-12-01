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
    .then((result) => {
      console.log('res', result)
    })
    .catch((error = {}) => {
      console.log(error)
      return {
        status: error.status || 404,
        body: {
          status: error.status || 404,
          message: error.message || 'CodeNotFound'
        }
      }
    })
    .then(({ status, body }) => callback(null, {
      statusCode: status,
      body: JSON.stringify(body),
      headers: { 'Access-Control-Allow-Origin': '*' }
    }))
}
