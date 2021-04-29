# [url-shortener](https://main.db4h915vvjqgs.amplifyapp.com/)

## Fork the [repo](https://github.com/toddlittle/url-shortener)
## Clone the forked repo
`git clone __FORKED_REPO_ADDRESS`

## Install dependencies
`cd url-shortener`
`yarn`

## Configure Amplify and AWS
This app makes use of a serverless architecture via the [AWS Amplify Framework](https://docs.amplify.aws/cli). The commands below cover the immediate steps required to get our app running, but the linked docs provide a wealth of knowledge if you run into issues or get stuck.

If you do not already have an AWS account, you will need to [create one](https://aws.amazon.com/).

After creating an account, you will need to [configure the Amplify CLI](https://docs.amplify.aws/cli/start/install). The intent of this step is to make your new AWS account available to the Amplify CLI.

`amplify configure`

After configuring, you will need to initialize the forked repo with your newly created AWS account.

`amplify init`

With Amplify CLI ready, you can push the code up AWS for provisioning.

`amplify push`

From here you can run the app locally pointed at the deployed services with `yarn start`, or Amplify also provides mocking options for running entirely local. Before moving on, let's make sure all the generated CloudFormation files have been pushed to GitHub.

`git add -A`
`git commit -m "push up amplify config"`
`git push origin main`

## Deploying the app

Initial setup of the CI/CD process requires logging into the AWS [Amplify console](https://console.aws.amazon.com/amplify/home). 

First, you will need to connect to your github repo. You can do that from the Amplify home page by clicking into the url-shortener app and finding the Frontend Environments tab. From there select GitHub and follow the steps to connect your newly forked repo. Once connected, you will find the (Re)Deploy button on the app home page. 

Lastly, don't forget to setup a redirect/rewrite to make subroutes play nice. See the [SO](https://stackoverflow.com/questions/57449853/react-router-dom-not-working-correctly-on-amplify-console-aws).

Once these steps are complete, the app will auto deploy and run tests on pushes to main based on the build steps in amplify.yml. It's also possible to configure PR builds/tests for more fine grained quality controls.

## If you run into issues
It's always tough to account for potential new deploy issues, especially across potentially myriad platforms, but the linked docs are very thorough and can likely help troubleshoot most issues. Also feel free to reach out if assistance is needed. I'm happy to help.