import { GraphQLOptions } from "apollo-server-lambda";
type ApolloServerPlugin = NonNullable<GraphQLOptions["plugins"]>[0];

// https://www.apollographql.com/docs/apollo-server/integrations/plugins/#request-lifecycle-event-flow
export const logger: ApolloServerPlugin = {
  async requestDidStart(context) {
    console.log(
      "Request started!",
      context.request.query,
      context.request.variables
    );

    return {
      async parsingDidStart() {
        console.log("Parsing started!");
      },

      async validationDidStart() {
        console.log("Validation started!");
      },

      async didEncounterErrors(context) {
        console.trace(
          "request error",
          context.errors.map((err) => JSON.stringify(err))
        );
      },
    };
  },
};
