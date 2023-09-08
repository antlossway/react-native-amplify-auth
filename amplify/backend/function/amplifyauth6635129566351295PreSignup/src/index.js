/* Amplify Params - DO NOT EDIT
	API_AMPLIFYAUTH_GRAPHQLAPIENDPOINTOUTPUT
	API_AMPLIFYAUTH_GRAPHQLAPIIDOUTPUT
	API_AMPLIFYAUTH_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */ /**
 * @fileoverview
 *
 * This CloudFormation Trigger creates a handler which awaits the other handlers
 * specified in the `MODULES` env var, located at `./${MODULE}`.
 */

/**
 * The names of modules to load are stored as a comma-delimited string in the
 * `MODULES` env var.
 */
const moduleNames = process.env.MODULES.split(",");
/**
 * The array of imported modules.
 */
const modules = moduleNames.map((name) => require(`./${name}`));

/**
 * This async handler iterates over the given modules and awaits them.
 *
 * @see https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html#nodejs-handler-async
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 *
 */
exports.handler = async (event, context) => {
  /**
   * Instead of naively iterating over all handlers, run them concurrently with
   * `await Promise.all(...)`. This would otherwise just be determined by the
   * order of names in the `MODULES` var.
   */
  // await Promise.all(modules.map((module) => module.handler(event, context)));
  const fetch = require("node-fetch");
  const GRAPHQL_ENDPOINT = process.env.API_AMPLIFYAUTH_GRAPHQLAPIENDPOINTOUTPUT;
  const GRAPHQL_API_KEY = process.env.API_AMPLIFYAUTH_GRAPHQLAPIKEYOUTPUT;

  const query = `
    mutation CREATE_USER($input: CreateUserInput!) {
      createUser(input: $input) {
        id
        email
      }
    }
  `;

  const variables = {
    input: {
      id: event.userName,
      email: event.request.userAttributes.email,
    },
  };

  console.log("#### debug variables: ", variables);

  const options = {
    method: "POST",
    headers: {
      "x-api-key": GRAPHQL_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  };

  const response = {};

  try {
    const res = await fetch(GRAPHQL_ENDPOINT, options);
    response.data = await res.json();
    if (response.data.errors) {
      throw new Error(JSON.stringify(response.data.errors));
    }
  } catch (error) {
    response.statusCode = 400;
    response.body = {
      errors: [
        {
          message: error.message,
          stack: error.stack,
        },
      ],
    };
  }
  return event;
};
