# AWS Lambda: Redeem Reward

Redeems a reward unless it was redeemed already in near past.

## Deployment
Deploy with `npm run deploy:{env}`.

## Environment variables

* `REDEMPTION_DELAY` is minimum time it has to pass before user can redeem again with the same promoter.
* `MENTIONS_TABLE` that the entries are stored in.

## Responses

If a user has not mentioned a promoter, it returns `404`.

If a user has redeemed a reward with a promoter, it returns `406`.

If it encounters any other error, it returns `500`.

On success it returns `200`.

