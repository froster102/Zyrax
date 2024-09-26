import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import PropTypes from "prop-types";
import RangeSlider from 'react-range-slider-input'
import 'react-range-slider-input/dist/style.css';
import { IoMdClose } from "react-icons/io";
import RadioComponent from "./RadioComponent";

const offerOptions = [
    {
        label: '10% and above',
        value: 10
    },
    {
        label: '20% and above',
        value: 20
    },
    {
        label: '30% and above',
        value: 30
    },
    {
        label: '40% and above',
        value: 40
    },
    {
        label: '50% and above',
        value: 50
    },
    {
        label: '60% and above',
        value: 60
    }
]

function Filter({ initialFilter, filter, setFilter, resetFilter }) {
    const ratings = [5, 4, 3, 2, 1]
    const [priceRange, setPriceRange] = useState([100, 3000])
    const [showClearFilter, setShowClearFilter] = useState(false)

    useEffect(() => {
        if (JSON.stringify(initialFilter) === JSON.stringify(filter)) setShowClearFilter(false)
        if (JSON.stringify(initialFilter) !== JSON.stringify(filter)) setShowClearFilter(true)
    }, [filter, initialFilter])

    return (
        <>
            <div className="md:block hidden border border-neutral-400 rounded-lg h-fit max-w-[280px] w-full p-4">
                <div className="flex w-full justify-between">
                    <p className="text-2xl font-semibold">Filters</p>
                    <button
                        onClick={() => {
                            resetFilter()
                            setPriceRange([100, 3000])
                        }}
                        className={`${showClearFilter ? 'flex' : 'hidden'} items-center bg-neutral-200 rounded-md px-2 py-1 text-sm`}>
                        <IoMdClose />
                        <p>Clear All</p>
                    </button>
                </div>
                <div className="text-lg font-medium">
                    <div>
                        <div className="w-full pt-2">Ratings</div>
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
                                min={100}
                                max={3000}
                                className='my-4'
                                rangeSlideDisabled={true}
                                value={priceRange}
                                defaultValue={[0, 100]}
                                onInput={setPriceRange}
                                onThumbDragEnd={() => {
                                    setFilter(prev => ({
                                        ...prev,
                                        minPrice: priceRange[0],
                                        maxPrice: priceRange[1]
                                    }))
                                }}
                            />
                            <p className="text-sm font-semibold">{`₹${priceRange[0]} - ₹${priceRange[1]}+`}</p>
                        </div>
                    </div>
                    <div>
                        <div className="pt-2 flex justify-between w-full">Availability</div>
                        <div className="pl-4 pt-2 text-base font-normal">
                            <input
                                onClick={() => setFilter(prev => ({
                                    ...prev,
                                    stock: 'inStock'
                                }))}
                                type="radio" name="availability" />
                            <label className="pl-2">In Stock</label>
                            <div>
                                <input
                                    onClick={() => setFilter(prev => ({
                                        ...prev,
                                        stock: 'outOfStock'
                                    }))}
                                    type="radio" name="availability" />
                                <label className="pl-2">Out of Stock</label>
                            </div>
                        </div>
                    </div>
                    <RadioComponent
                        name={'Offer Range'}
                        options={offerOptions}
                        value={String(filter.offerPercentage)}
                        onChange={(e) => setFilter(prev => ({
                            ...prev,
                            offerPercentage: e.target.value
                        }))}
                    />
                </div>
            </div>
        </>
    )
}

Filter.propTypes = {
    initialFilter: PropTypes.object,
    filter: PropTypes.object,
    setFilter: PropTypes.func,
    resetFilter: PropTypes.func
}

export default Filter