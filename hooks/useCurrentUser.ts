import useSWR from "swr";
import fetcher from "@/libs/fetcher";

const useCurrentUser = () => {
  const { data, error, isLoading, mutate } = useSWR("/api/current", fetcher); //it will fetch data from /api/current and return user object
  //SWR don't refetch the data if it's already in cache

  return {
    data,
    isLoading,
    mutate,
    error,
  };
};

export default useCurrentUser;
