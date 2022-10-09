import { Fragment, useState } from "react";
import { useInfiniteQuery } from "react-query";
import axios from "axios";

// useInfiniteQueries inserts some parameters in the fetcher function
const fetchColors = ({ pageParam = 1 }) => {
  return axios.get(`http://localhost:4000/colors?_limit=2&_page=${pageParam}`);
};

export const InfiniteQueriesPage = () => {
  const {
    isLoading,
    isError,
    error,
    data,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(["colors"], fetchColors, {
    // using this "getNextPageParam" to change the pageParam bcz "pageParam" is managed by react-query
    getNextPageParam: (lastPage, pages) => {
      if (pages.length < 4) {
        return pages.length + 1;
      } else {
        return undefined;
      }
    },
    // "getNextPageParam" sets the "hasNextPage"'s value to true or false. This boolean is helpful in enabling & disabling the button
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <div>
        {/* useInfiniteQuery returns "pages" object instead of "data" object */}
        {/* this "pages" list goes on increasing as more & more pages are loaded */}
        {/* each "page" contains "limit" number of items */}
        {data?.pages.map((page, i) => {
          // This above "group" is not visible in the REACT QUERY DATA EXPLORER
          // "group" groups together data from multiple "pages"
          return (
            <Fragment key={i}>
              {JSON.stringify(page)}
              {page.data.map((color) => (
                <h2 key={color.id}>
                  {color.id}-{color.label}
                </h2>
              ))}
            </Fragment>
          );
        })}
      </div>
      <div>
        <button disabled={!hasNextPage} onClick={fetchNextPage}>
          Load More
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching" : null}</div>
    </>
  );
};
