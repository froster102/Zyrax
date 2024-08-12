import { useSelector } from "react-redux"
import WishlistProductCard from "../../components/WishlistProductCard"
import { selectWishlistItems } from "../../features/userSlice"
import { Link } from "react-router-dom"

function Wishlist() {
  const items = useSelector(selectWishlistItems)
  return (
    <>
      <div className="w-[1024px] ml-auto mr-auto mt-8">
        <h1 className="mt-10 font-semibold text-lg">My Wishlist <span className="font-light">({items.length} Items)</span></h1>
        <div className="flex gap-4 mt-4 flex-wrap">
          {items.map((item, i) => <WishlistProductCard key={i} product={item}></WishlistProductCard>)}
        </div>
      </div>
    </>
  )
}

export default Wishlist