import { ApolloServer } from "apollo-server-lambda";
import { APIGatewayProxyEvent, Context as lambdaContext } from "aws-lambda";

import {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
} from "./graphql/graphql";
import { logger } from "./graphql/plugin";
import typeDefs from "./graphql/schema.graphql";

type ResolverType = Resolvers & {
  Query: Required<QueryResolvers>;
  Mutation: Required<MutationResolvers>;
};

// Provide resolver functions for your schema fields
const resolvers: ResolverType = {
  Query: {
    getItem: async () => ({ name: "getItem" }),
    listItem: async () => [{ name: "listItem" }],
  },
  Mutation: {
    createItem: async () => ({ name: "created" }),
  },
};

// see https://github.com/apollographql/apollo-server/tree/apollo-server-lambda%402.25.3/packages/apollo-server-lambda
type ContextType = {
  event: APIGatewayProxyEvent;
  context: lambdaContext;
};

const server = new ApolloServer({
  typeDefs,
  resolvers,

  context: async ({ event, context }: ContextType) => {
    // 権限チェックする
    // const token = event.headers.Authorization || event.headers.authorization || "";

    return {
      event,
      context,
      // contextと一緒に権限の値をわたす
      // store: store,
    };
  },
  introspection: true,
  plugins: [logger],
});

exports.graphqlHandler = server.createHandler();
