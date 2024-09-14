import LookingEmoji from '../../assets/lookingEmoji.png'

function NotFound() {
    return (
        <>
            <div className='w-full flex justify-center mt-24 mb-24' >
                <div className='w-96 h-fit bg-black p-10 rounded-lg  flex' >
                    <img className=' w-32' src={LookingEmoji} alt="" />
                    <h1 className=' text-white font-extrabold text-2xl ml-4' >Can&apos;t find the page you are looking for !</h1>
                </div>
            </div>
        </>
    )
}

export default NotFound