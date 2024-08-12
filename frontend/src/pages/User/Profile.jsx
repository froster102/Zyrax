import { useGetProfileQuery } from "../../features/userApiSlice"

function Profile() {
  const { data } = useGetProfileQuery()
  return (
    <div className="text-4xl font-semibold text-center">Profile</div>
  )
}

export default Profile