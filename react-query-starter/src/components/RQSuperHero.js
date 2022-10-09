import { useParams } from "react-router-dom";
import { useSuperHeroData } from "../hooks/useSuperHeroData";

export const RQSuperHeroPage = () => {
  const { heroId } = useParams();

  const { isLoading, data } = useSuperHeroData(heroId);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <h2>Super Hero details</h2>
      {data?.data.name} - {data?.data.alterEgo}
    </>
  );
};
