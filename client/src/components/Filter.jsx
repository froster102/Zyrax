import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import PropTypes from "prop-types";
import RangeSlider from 'react-range-slider-input'
import 'react-range-slider-input/dist/style.css';
import { IoMdClose } from "react-icons/io";
import RadioComponent from "./RadioComponent";
import { CiFilter } from "react-icons/ci";
import { BsSortUp } from "react-icons/bs";
import { AnimatePresence, motion } from 'framer-motion'

const offerOptions = [
    { label: '10% and above', value: 10 },
    { label: '20% and above', value: 20 },
    { label: '30% and above', value: 30 },
    { label: '40% and above', value: 40 },
    { label: '50% and above', value: 50 },
    { label: '60% and above', value: 60 }
]

function Filter({ initialFilter, filter, setFilter, resetFilter, sort, setSort }) {
    const ratings = [5, 4, 3, 2, 1]
    const [priceRange, setPriceRange] = useState([100, 3000])
    const [showClearFilter, setShowClearFilter] = useState(false)
    const [openFilter, setOpenFilter] = useState(false)
    const [openSort, setOpenSort] = useState(false)

    useEffect(() => {
        if (JSON.stringify(initialFilter) === JSON.stringify(filter)) setShowClearFilter(false)
        if (JSON.stringify(initialFilter) !== JSON.stringify(filter)) setShowClearFilter(true)
    }, [filter, initialFilter])

    function handleSortChange(sortOption) {
        setSort(sortOption)
        setOpenSort(false)
    }

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
            <AnimatePresence>

                {
                    openFilter &&
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ stiffness: 300, damping: 30 }}
                        className="md:block fixed left-0 top-0 bg-neutral-100 z-50 w-full h-full border border-neutral-400 rounded-md p-4">
                        <div className="flex w-full justify-between">
                            <p className="text-2xl font-semibold">Filters</p>
                            <button
                                onClick={() => {
                                    resetFilter()
                                    setPriceRange([100, 3000])
                                    setOpenFilter(false)
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
                                            setOpenFilter(false)
                                        }}
                                    />
                                    <p className="text-sm font-semibold">{`₹${priceRange[0]} - ₹${priceRange[1]}+`}</p>
                                </div>
                            </div>
                            <div>
                                <div className="pt-2 flex justify-between w-full">Availability</div>
                                <div className="pl-4 pt-2 text-base font-normal">
                                    <input
                                        onClick={() => {
                                            setFilter(prev => ({
                                                ...prev,
                                                stock: 'inStock'
                                            }))
                                            setOpenFilter(false)
                                        }
                                        }
                                        type="radio" checked={filter.stock === 'inStock'} name="availability" />
                                    <label className="pl-2">In Stock</label>
                                    <div>
                                        <input
                                            onClick={() => {
                                                setFilter(prev => ({
                                                    ...prev,
                                                    stock: 'outOfStock'
                                                }))
                                                setOpenFilter(false)
                                            }
                                            }
                                            type="radio" checked={filter.stock === 'outOfStock'} name="availability" />
                                        <label className="pl-2">Out of Stock</label>
                                    </div>
                                </div>
                            </div>
                            <RadioComponent
                                name={'Offer Range'}
                                options={offerOptions}
                                value={String(filter.offerPercentage)}
                                onChange={(e) => {
                                    setFilter(prev => ({
                                        ...prev,
                                        offerPercentage: e.target.value
                                    }))
                                    setOpenFilter(false)
                                }
                                }
                            />
                        </div>
                    </motion.div>
                }
            </AnimatePresence>

            <div className="md:hidden fixed w-full bottom-0 left-0 z-50 text-white">
                <AnimatePresence>
                    {openSort &&
                        (
                            <>
                                <motion.div
                                    initial={{ y: '100%', opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: '100%', opacity: 0 }}
                                    transition={{ stiffness: 300, damping: 30 }}
                                    className="fixed z-50 bottom-0 w-full bg-neutral-200 text-black font-medium rounded-t-lg"
                                >
                                    <p className="text-xl pl-4 flex items-center gap-2 pt-4"><BsSortUp />Sort</p>
                                    <ul>
                                        <li onClick={() => handleSortChange('L2H')} className="py-4 flex items-center justify-between border-b  border-b-neutral-300 px-4">
                                            <p>Low to High</p>
                                            <input name="sort" defaultChecked={sort === 'L2H'} type="radio" />
                                        </li>
                                        <li onClick={() => handleSortChange('H2L')} className="py-4 flex items-center justify-between border-b  border-b-neutral-300 px-4">
                                            <p>High to Low</p>
                                            <input name="sort" defaultChecked={sort === 'H2L'} type="radio" />
                                        </li>
                                        <li onClick={() => handleSortChange('A2Z')} className="py-4 flex items-center justify-between border-b  border-b-neutral-300 px-4">
                                            <p>A-Z</p>
                                            <input name="sort" defaultChecked={sort === 'A2Z'} type="radio" />
                                        </li>
                                        <li onClick={() => handleSortChange('Z2A')} className="py-4 flex items-center justify-between border-b  border-b-neutral-300 px-4">
                                            <p>Z-A</p>
                                            <input name="sort" defaultChecked={sort === 'Z2A'} type="radio" />
                                        </li>
                                        <li onClick={() => handleSortChange('newest')} className="py-4 flex items-center justify-between border-b  border-b-neutral-300 px-4">
                                            <p>Newest</p>
                                            <input name="sort" defaultChecked={sort === 'newest'} type="radio" />
                                        </li>
                                    </ul>
                                </motion.div>
                                <div onClick={() => { setOpenSort(false) }} className="fixed inset-0 bg-neutral-900 bg-opacity-75 w-full h-screen transition-all backdrop-blur-sm z-40"></div>
                            </>
                        )
                    }
                </AnimatePresence>
                <div className="flex">
                    <button
                        onClick={() => setOpenFilter(!openFilter)}
                        className="bg-neutral-800 text-white px-4 py-2  w-full flex items-center justify-center border-r border-l-white">
                        {openFilter ? 'Close' : <><CiFilter />Filter</>}
                    </button>
                    <button onClick={() => setOpenSort(true)} className="bg-neutral-800 text-white px-4 py-2  w-full flex items-center justify-center"><BsSortUp />Sort</button>
                </div>
            </div>
        </>
    )
}

Filter.propTypes = {
    initialFilter: PropTypes.object,
    filter: PropTypes.object,
    setFilter: PropTypes.func,
    resetFilter: PropTypes.func,
    sort: PropTypes.object,
    setSort: PropTypes.func
}

export default Filter