import { Controller } from 'react-hook-form'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

function StockSelector({ control }) {
    return (
        <>{
            <div className='max-h-36 flex flex-col flex-wrap gap-2'>
                {SIZES.map((size) => {
                    return <div key={size} className='flex justify-center items-center gap-2'>
                        <p className='border border-stone-500 w-12 h-8 flex justify-center items-center rounded-md mt-2 bg-stone-300'>{size}</p>
                        <Controller
                            name={`stock.${size}`}
                            control={control}
                            defaultValue=''
                            render={({ field }) => {
                                return (
                                    <input
                                        {...field}
                                        type='text'
                                        className='rounded-md w-16 h-full border border-stone-300 focus:outline-none p-1 mt-2'
                                        placeholder={`Stock for ${size}`}
                                    />
                                )
                            }}
                        />
                    </div>
                })}
            </div>


        }
        </>

    )
}

StockSelector.propTypes

export default StockSelector