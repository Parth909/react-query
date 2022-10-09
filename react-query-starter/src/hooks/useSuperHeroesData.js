import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { request } from "../utils/axios-utils";

// FETCHER FUNCTION
const fetchSuperHeroes = () => {
  // return the promise
  // return axios.get("http://localhost:4000/superheroes");
  return request({ url: "/superheroes" });
};

// MUTATION FUNCTION :- for CREATING, UPDATING, DELETING data
const addSuperHero = (hero) => {
  // return axios.post("http://localhost:4000/superheroes", hero);

  return request({ url: "/superheroes", method: "post", data: hero });
};

export const useSuperHeroesData = (onSuccess, onError) => {
  // return the data returned by useQuery hook
  return useQuery("super-heroes", fetchSuperHeroes, {
    onSuccess,
    onError,
    enabled: true,
    // select: (data) => {
    //   const superHeroNames = data.data.map((hero) => hero.name);
    //   return superHeroNames;
    // },
  });
};

export const useAddSuperHeroData = () => {
  const queryClient = useQueryClient();
  return useMutation(addSuperHero, {
    // onSuccess Callback
    // onSuccess: (data) => {
    // ===INVALIDATION===
    // the query-key of the query which we want to invalidate
    // this will trigger a refetch for that query
    // queryClient.invalidateQueries("super-heroes");

    // ===UPDATING THE STATE WITH THE DATA RETURNED WITHOUT INVALIDATING THE CACHE===
    // which part of query-cache to update
    // queryClient.setQueryData("super-heroes", (oldQueryData) => {
    //   // "oldQueryData" is the already present data in the cache with query-key "super-heroes"
    //   return {
    //     ...oldQueryData,
    //     data: [...oldQueryData.data, data.data],
    //     // oldQueryData can be seen in the devtools
    //   };
    // });
    // },

    // ===OPTIMISTIC UPDATE===
    // "onMutate" fired before the "MUTATION FUNCTION" is called & the same data as the MUTATION FUNCTION is also passed to the "onMutate" function
    onMutate: async (newHero) => {
      // cancel any BACKGROUND REFETCHES
      await queryClient.cancelQueries("super-heroes");
      const previousHeroData = queryClient.getQueryData("super-heroes");
      queryClient.setQueryData("super-heroes", (oldQueryData) => {
        // "oldQueryData" is the already present data in the cache with query-key "super-heroes"
        return {
          ...oldQueryData,
          data: [
            ...oldQueryData.data,
            { id: oldQueryData?.data?.length + 1, ...newHero }, // adding the "id" field
          ],
          // oldQueryData can be seen in the devtools
        };
      });

      // this will be used to rollback the data incase the mutation throws an error
      return {
        previousHeroData,
      };
    },
    onError: (_error, _newHero, context) => {
      // newHero is the one passed to the mutation but we don't need that now, so adding an underscore before it
      // context contains additional information related to the mutation. IT ALSO CONTAINS THE DATA RETURNED BY THE MUTATION which can be used for ROLLBACK
      queryClient.setQueryData("super-heroes", context.previousHeroData);
    },
    onSettled: () => {
      // "onSettled" is called when the mutation is successful or throws an error
      queryClient.invalidateQueries("super-heroes");
    },
  });
};
