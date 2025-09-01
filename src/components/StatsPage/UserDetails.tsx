import { useQuery } from "@tanstack/react-query";

import StatsPageErrorComponent from "./StatsPageErrorComponent";

import { getSpotifyUserDetails } from "../../api/spotify/spotify";
import { getErrorText } from "../../utils/utils";
import { Link } from "react-router";

const UserDetails = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["/spotify/me"],
    queryFn: getSpotifyUserDetails,
  });

  if (isLoading) {
    return <div>SKELETON</div>;
  }

  if (error) {
    console.log(error);
    const errorText = getErrorText(error);
    return <StatsPageErrorComponent errorText={errorText} />;
  }

  if (!data) {
    return <StatsPageErrorComponent errorText="No user data available" />;
  }

  let greeting = "";
  const hours = new Date().getHours();
  switch (true) {
    case hours >= 0 && hours < 5:
      greeting = "Welcome,";
      break;
    case hours >= 5 && hours < 12:
      greeting = "Good Morning,";
      break;
    case hours >= 12 && hours < 17:
      greeting = "Good Afternoon,";
      break;
    case hours >= 17 && hours <= 24:
      greeting = "Good Evening,";
      break;
  }

  // Use placeholder image if the user doesnt have a profile pic
  if (!data.images || !data.images.length || !data.images[0].url) {
    data.images = [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
      },
    ];
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-4xl font-bold">
          {greeting}{" "}
          <Link to={data.external_urls} className="text-spotify-green hover:underline">
            {data.display_name}
          </Link>
        </h3>
        {data.images[0].url && (
          <img
            src={data.images[0]?.url}
            alt={`${!data.images[0].height ? "Placeholder " : ""}Image of ${data.display_name}'s profile picture`}
            className="h-[80px] w-[80px] rounded-full object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default UserDetails;
