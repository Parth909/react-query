import { useState } from "react";
import {
  useSuperHeroesData,
  useAddSuperHeroData,
} from "../hooks/useSuperHeroesData";
import { Link } from "react-router-dom";

export const RQSuperHeroesPage = () => {
  const [name, setName] = useState("");
  const [alterEgo, setAlterEgo] = useState("");

  const {
    mutate: addHeroMutate,
    isLoading: isMutationLoading,
    isError: isMutationError,
    error: mutationError,
  } = useAddSuperHeroData();

  const handleAddHeroClick = () => {
    const hero = { name, alterEgo };
    addHeroMutate(hero);
  };

  // React injects data in the callbacks
  const onSuccess = (data) => {
    console.log("Perform side effect after data fetching", data);
  };

  // React injects data in the callbacks
  const onError = (error) => {
    console.log("Perform side effect on error", error);
  };

  const { isLoading, data, isError, error, isFetching, refetch } =
    useSuperHeroesData(onSuccess, onError);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <h2>React Query Super Heroes Page</h2>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          value={alterEgo}
          onChange={(e) => setAlterEgo(e.target.value)}
        />
        <button onClick={handleAddHeroClick}>Add Hero</button>
      </div>
      <button onClick={refetch}>Fetch heroes</button>
      {data?.data.map((hero) => (
        <div key={hero.id}>
          <Link to={`/rq-super-heroes/${hero.id}`}>{hero.name}</Link>
        </div>
      ))}
      {/* {data && data.map((name) => <div key={name}>{name}</div>)} */}
    </>
  );
};
