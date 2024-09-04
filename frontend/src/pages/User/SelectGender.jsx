import { Link } from "react-router-dom"

function SelectGender() {
    return (
        <div className="flex w-full justify-center py-10 gap-4">
            <div className="relative">
                <img className="w-[740px] [526px]" src="/brooke-cagle-wKOKidNT14w-unsplash (1).jpg" alt="" />
                <div className="absolute top-0 group hover:backdrop-blur-sm w-full h-full flex justify-center items-center transition-all ease-in">
                    <Link to={'/men'} ><button className="hidden group-hover:block px-4 py-2 bg-stone-900 rounded-md text-white">Men</button></Link>
                </div>
            </div>
            <div className="relative">
                <img className="w-[740px] h-[526px]" src="/mike-von-TPUGbQmyVwE-unsplash.jpg" alt="" />
                <div className="absolute top-0 group hover:backdrop-blur-sm w-full h-full flex justify-center items-center transition-all ease-in">
                    <Link to={'/women'} ><button className="hidden group-hover:block px-4 py-2 bg-stone-900 rounded-md text-white">Women</button></Link>
                </div>
            </div>
        </div>
    )
}

export default SelectGender