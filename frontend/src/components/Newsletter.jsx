
function Newsletter() {
    let a = []
    a.sh
    return (
        <>
            <div className="w-full relative">
                <img className="h-[430px] w-full object-cover rounded-[30px]" src="/dummy/jose-p-ortiz-SS_cnBdMheo-unsplash.jpg" alt="" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <h1 className="font-extrabold text-center lg:text-5xl text-3xl">Stay In Touch</h1>
                    <div className="bg-white rounded-[30px] lg:w-[479px] md:w-[379px] sm:w-[279px] mt-2 p-1 flex justify-between">
                        <input className="w-full rounded-[30px] p-2 hover:border-none outline-none" placeholder="Enter your email" type="text" />
                        <button className="text-white bg-black px-4 py-2 rounded-full text-nowrap">Join Us</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Newsletter