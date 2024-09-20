import PropTypes from 'prop-types'

function Pagination({ currentPage, totalPages, onPageChange }) {
    const renderPageNumbers = () => {
        const pageNumbers = []
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pageNumbers.push(
                    <button className='ml-2 px-2 py-1 rounded-md bg-neutral-300 shadow-xl' key={i} onClick={() => onPageChange(i)} disabled={i === currentPage}>
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
        <div className='flex justify-center'>
            <div className='mt-4'>
                <button className='mr-2 px-2 py-1 rounded-md bg-neutral-300 shadow-xl' onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                    {'<'}
                </button>
                {renderPageNumbers()}
                <button className='ml-2 px-2 py-1 rounded-md bg-neutral-300 shadow-xl' onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    {'>'}
                </button>
            </div>
        </div>
    )
}

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired
}

export default Pagination