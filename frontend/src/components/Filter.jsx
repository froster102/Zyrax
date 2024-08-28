import { useState } from "react";
import { FaStar } from "react-icons/fa";
import RangeSlider from 'react-range-slider-input'
import 'react-range-slider-input/dist/style.css';

function Filter() {
    const ratings = [5, 4, 3, 2, 1]
    const [priceRange, setPriceRange] = useState([0, 3000])
    return (
        <>
            <div className="md:block hidden border border-neutral-400 rounded-lg h-fit max-w-[280px] w-full p-4">
                <div className="text-lg font-medium">
                    <div>
                        <div className="pt-2 w-full">Ratings</div>
                        <div className="pl-4">
                            {
                                ratings.map((e, i) => {
                                    return <div key={i} className="pt-2 flex text-base">
                                        <input className="w-3" type="radio" name="rating" />
                                        {[...Array(e)].map((_, i) => <FaStar className="ml-2" key={i} />)}
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div>
                        <div className="pt-2 flex justify-between w-full">Price</div>
                        <div className="pl-4">
                            <RangeSlider
                                min={0}
                                max={3000}
                                className='my-4'
                                rangeSlideDisabled={true}
                                value={priceRange}
                                defaultValue={[0, 100]}
                                onInput={setPriceRange}
                                onThumbDragEnd={() => { console.log('end') }}
                            />
                            <p className="text-sm font-normal">{`₹${priceRange[0]} - ₹${priceRange[1]}`}</p>
                        </div>
                    </div>
                    <div>
                        <div className="pt-2 flex justify-between w-full">Availability</div>
                        <div className="pl-4 pt-2 text-base font-normal">
                            <input type="radio" name="availability" />
                            <label className="pl-2">In Stock</label>
                            <div>
                                <input type="radio" name="availability" />
                                <label className="pl-2">Out of Stock</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="pt-2 flex justify-between w-full">Discount Range</div>
                        <div className="pl-4 pt-2 text-base font-normal">
                            <input type="radio" name="discount" />
                            <label className="pl-2">10% and above</label>
                            <div>
                                <input type="radio" name="discount" />
                                <label className="pl-2">20% and above</label>
                            </div>
                            <div>
                                <input type="radio" name="discount" />
                                <label className="pl-2">30% and above</label>
                            </div>
                            <div>
                                <input type="radio" name="discount" />
                                <label className="pl-2">40% and above</label>
                            </div>
                            <div>
                                <input type="radio" name="discount" />
                                <label className="pl-2">50% and above</label>
                            </div>
                            <div>
                                <input type="radio" name="discount" />
                                <label className="pl-2">60% and above</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center pt-4">
                    <button className="px-2 py-1 bg-neutral-900 rounded-lg text-white">Apply filter</button>
                </div>
            </div>
        </>
    )
}

export default Filter