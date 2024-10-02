import PropTypes from 'prop-types'
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";

function Pagination({ currentPage, totalPages, onPageChange }) {
    const renderPageNumbers = () => {
        const pageNumbers = []
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pageNumbers.push(
                    <button className='h-[32px] text-lg font-medium px-2 bg-neutral-300 shadow-xl' key={i} onClick={() => onPageChange(i)} disabled={i === currentPage}>
                        {i}
                    </button>
                )
            } else if ((i === 2 && currentPage > 3) || (i === totalPages - 1 && currentPage < totalPages - 2)) {
                pageNumbers.push(<span className='ml-2' key={`ellipsis-${i}`}>...</span>)
            }
        }
        return pageNumbers
    }
    return (
        <div className='flex justify-center items-center mt-4 '>
            {totalPages > 1 && <button className='p-2 h-[32px] rounded-l-md bg-neutral-300 shadow-xl' onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                <SlArrowLeft size={12} />
            </button>}
            {totalPages > 1 && renderPageNumbers()}
            {totalPages > 1 && <button className='p-2 h-[32px] rounded-r-md bg-neutral-300 shadow-xl' onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                <SlArrowRight size={12} />
            </button>}
        </div >
    )
}

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired
}

export default Pagination