import Skeleton from 'react-loading-skeleton'

function TrendingRowSkeleton() {
    return (
        <>
            <div className="w-[400px] h-[500px] border border-[#E6E6E6] inline-block ml-2 rounded-[20px] relative">
                <Skeleton className='w-[400px] h-[500px] rounded-[20px]' />
            </div>
        </>
    )
}

export default TrendingRowSkeleton