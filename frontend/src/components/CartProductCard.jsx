import _ from "lodash"

function CartProductCard({ product, removeFromCart }) {
    return (
        <div className="bg-[#f1f1f1] min-w-[769px] h-[173px] rounded-[20px] border border-[#CFCBCB] flex p-[10px] relative mt-2">
            <img className="w-[127px] h-[146px] rounded-[20px]" src={product.imageUrls[0]} alt="" />
            <div className="flex justify-between w-full pl-4">
                <div>
                    <p className="font-semibold">{_.startCase(product.name)}</p>
                    <div className="flex py-2">
                        <p className="border border-[#CFCBCB] text-xs rounded-full text-[#828282] px-2 flex items-center justify-center">Size : M</p>
                        <select className="ml-2 border border-[#CFCBCB] text-xs rounded-full text-[#828282] px-2 flex items-center justify-center">Qty
                            <option value="">1</option>
                            <option value="">2</option>
                            <option value="">3</option>
                            <option value="">4</option>
                        </select>
                    </div>
                </div>
                <div>
                    <p className="font-semibold text-right">₹ {product.price}</p>
                    <p className="text-sm font-medium">MRP incl. of all taxes</p>
                </div>
            </div>
            <button onClick={() => { removeFromCart(product) }} className="absolute bottom-5 right-2 px-2 bg-white rounded-full border border-black text-sm font-medium" >Remove</button>
        </div>
    )
}

export default CartProductCard