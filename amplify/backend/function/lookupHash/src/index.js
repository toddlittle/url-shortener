const AWS = require('aws-sdk');

/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_DYNAMO1A1B4240_ARN
	STORAGE_DYNAMO1A1B4240_NAME
Amplify Params - DO NOT EDIT */

exports.handler = async (event) => {
	AWS.config.update({region: process.env.REGION });

	const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});  

	return new Promise((resolve, reject) => {
		ddb.getItem({
			TableName: process.env.STORAGE_DYNAMO1A1B4240_NAME,
			Key: {
				hash: {
					"S": event.arguments.hash
				}
			}
		}, (err, data) => {
			if (err) {
				console.error(err);
				reject(err);
			} else {                
				resolve(data.Item.url.S);
			}	
		});
	});
};


