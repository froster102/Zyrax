import { Controller } from 'react-hook-form'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

function SizeSelector({ control }) {
    return (
        <Controller
            name='sizes'
            control={control}
            defaultValue={[]}
            render={({ field: { value, onChange } }) => {
                return (<div className='mt-1 flex gap-2'>
                    {SIZES.map((size) => {
                        return (
                            <div key={size}
                                onClick={() => {
                                    let newSizes = value.includes(size)
                                        ? value.filter(selectedSizes => selectedSizes !== size)
                                        : [...value, size]
                                    onChange(newSizes)
                                }}
                                className={`w-[46px] h-[46px] rounded-md ${value.includes(size) ? 'bg-black text-white' : 'bg-[#D9D9D9]'} transition ease-in flex justify-center items-center border-[1px] border-black`}>
                                <p className='text-lg font-medium'>{size}</p>
                            </div>
                        )
                    })}
                </div>)
            }}
        />
    )
}

export default SizeSelector