import ProTypes from 'prop-types'

function StockTable({ stock }) {

    return (
        <div className='border border-neutral-400 rounded-md w-fit'>
            <table>
                <thead className='bg-neutral-300-300'>
                    <tr className='border-b border-stone-400'>
                        {stock.map(({ size }) => <th className='px-2 text-center' key={size}><p>{size}</p></th>)}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {stock.map(({ quantity }) => <td className='px-2 text-center' key={quantity}>{quantity}</td>)}
                    </tr>
                </tbody>
            </table>
        </div>

    )
}

StockTable.propTypes = {
    stock: ProTypes.array.isRequired
}

export default StockTable