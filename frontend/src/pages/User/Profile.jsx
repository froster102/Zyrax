import { useGetProfileQuery } from "../../features/userApiSlice"

function Profile() {
  const { data } = useGetProfileQuery()
  console.log(data)
  return (
    <div className="text-4xl font-semibold text-center">Profile</div>
  )
}

export default Profile