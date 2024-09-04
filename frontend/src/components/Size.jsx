import Skeleton from 'react-loading-skeleton'
import PropTypes from 'prop-types'

const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

function Size({ sizes, isLoading, selectedSize, setSelectedSize, setActiveItem }) {
    const sizeQtyMap = sizes.reduce((acc, { size, quantity }) => {
        acc[size] = quantity
        return acc
    }, {})

    return (
        <>
            {
                isLoading ? [...Array(4)].map((e, i) => {
                    return <Skeleton key={i} className='w-[48px] h-[28px] border border-[#CFCBCB] rounded-full  flex items-center justify-center text-sm' />
                })
                    :
                    defaultSizes.map((size) => (
                        sizeQtyMap[size] > 0 ? (
                            <div key={size} onClick={() => {
                                setSelectedSize(size)
                                setActiveItem ? setActiveItem(false) : ''
                            }} className={`w-[48px] h-[28px] border border-[#CFCBCB] rounded-full  flex items-center justify-center text-sm ${size === selectedSize ? 'bg-stone-800 text-white' : ''}`} >
                                <p>{size}</p>
                            </div>
                        ) : (
                            <div key={size} className='w-[48px] h-[28px] border border-[#CFCBCB] bg-[#CFCBCB] rounded-full flex items-center justify-center text-sm'>
                                <p>{size}</p>
                            </div>
                        )
                    ))
            }
        </>
    )
}

Size.propTypes = {
    sizes: PropTypes.array,
    isLoading: PropTypes.bool,
    selectedSize: PropTypes.string,
    setSelectedSize: PropTypes.func,
    setActiveItem: PropTypes.func
}

export default Size