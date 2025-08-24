import { useQuery } from "@tanstack/react-query"
import { getSpotifyUserDetails } from "../../api/spotify/spotify"

const UserDetails = () => {
  const {isLoading, error, data} = useQuery({
    queryKey: ["/spotify/me"],
    queryFn: getSpotifyUserDetails,
  })

  if (isLoading) {
    return <div>SKELETON</div>
  }

  if (error) {
    return <div>Some went wrong, please try logging in again</div>
  }

  return (
    <div>
      UserDetails
      <pre>{JSON.stringify(data!.data, null, 2)}</pre>
    </div>
  )
}

export default UserDetails