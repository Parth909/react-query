import { useQuery } from "react-query";
import axios from "axios";

const fetchUserByEmail = (email) => {
  return axios.get(`http://localhost:4000/users/${email}`);
};

const fetchChannelById = (channelId) => {
  return axios.get(`http://localhost:4000/channels/${channelId}`);
};

export const DependentQueriesPage = ({ email }) => {
  const { data: user } = useQuery(["user", email], () =>
    fetchUserByEmail(email)
  );

  // channelId will be undefined first
  const channelId = user?.data.channelId;

  const { data: channel } = useQuery(
    ["channel", channelId],
    () => fetchChannelById(channelId),
    {
      enabled: !!channelId, // !! converts the value to boolean
      // will be true only after the channelId is present
    }
  );

  return <div>Dependent Queries</div>;
};
