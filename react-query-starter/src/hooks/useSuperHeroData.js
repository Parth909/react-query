import { useQuery, useQueryClient } from "react-query";
import axios from "axios";

const fetchSuperHero = (heroId) => {
  return axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

const fetchSuperHeroAnotherWay = (params) => {
  console.log(params);
  const heroId = params.queryKey[1];
  return axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

export const useSuperHeroData = (heroId) => {
  const queryClient = useQueryClient();

  return useQuery(["super-hero", heroId], () => fetchSuperHero(heroId), {
    initialData: () => {
      // get data of the query with 'super-heroes' key
      const hero = queryClient
        .getQueryData("super-heroes")
        ?.data?.find((hero) => hero.id === parseInt(heroId));

      if (hero) {
        // this format is important bcz this is how we are consuming data in the component
        return {
          data: hero,
        };
      } else {
        return undefined;
      }
    },
  });

  // Way 1
  // return useQuery(["super-hero", heroId], () => fetchSuperHero(heroId));

  // Way 2 :- useQuery automatically passes many things to the FETCHER FUNCTIONS
  // return useQuery(["super-hero", heroId], fetchSuperHeroAnotherWay);
};
