import { type ApolloClient, type NormalizedCacheObject } from "@apollo/client";
import { useMemo } from "react";
import { createApolloClient } from "~/lib/apollo/apollo-client";

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const initializeApollo = (initialState?: NormalizedCacheObject) => {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR, always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
};

const useApollo = (initialState?: NormalizedCacheObject) => {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
};

const client = initializeApollo();

export { initializeApollo, useApollo, client };
