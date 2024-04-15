---NOTICE: .env CONFIG---
This repo requires a .env with the following fields

VITE_AWS_REGION = [reqion from AWS console]
VITE_AWS_ACCESS_KEY = [access key from aws console]
VITE_AWS_SECRET_KEY = [secret key from aws console]
VITE_AWS_TABLE_NAME = [table name for target aws dynamo db table]

VITE_MAPS_KEY = [google maps api key]

---NOTICE: DYNAMODB TABLE---
DynamoDB table should have session ID partition key (long alphanumeric string) and a timestamp sort key (new Date converted to a string)