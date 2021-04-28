const AWS = require('aws-sdk');
const Hashids = require('hashids');
const isUri = require('is-valid-http-url');

/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_DYNAMO1A1B4240_ARN
	STORAGE_DYNAMO1A1B4240_NAME
Amplify Params - DO NOT EDIT */

exports.handler = async (event) => {
	AWS.config.update({region: process.env.REGION });

	const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});  

	const hashids = new Hashids(event.arguments.input);

	return new Promise((resolve, reject) => {
		const url = event.arguments.input;
		const hash = hashids.encode(Date.now());

		if (!isUri(url)) {
			const error = new Error('You must pass a valid url.');
			reject(error);
		} else {
			ddb.putItem({
				TableName: process.env.STORAGE_DYNAMO1A1B4240_NAME,
				Item: {
					url: {
						"S": url
					},
					hash: {
						"S": hash
					}
				}
			}, (error) => {
				if (error) {
					reject(err)
				} else {                
					resolve({ url, hash });
				}	
			});	
		}		
	});
};


