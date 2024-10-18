import { Link } from "react-router-dom"

function SelectGender() {
    return (
        <div className="flex w-full h-full justify-center py-10 gap-4 px-4">
            <div className="relative">
                
                <img className="w-[740px] max-h-[626px] object-cover" src="/brooke-cagle-wKOKidNT14w-unsplash (1).jpg" alt="" />
                <div className="absolute top-0 group hover:backdrop-blur-sm w-full h-full flex justify-center items-center transition-all ease-in">
                    <Link to={'/men'} ><button className="hidden group-hover:block px-4 py-2 bg-neutral-900 rounded-md text-white">Men</button></Link>
                </div>
            </div>
            <div className="relative">
                <img className="w-[740px] max-h-[626px] object-cover" src="/maxence-pira-ds1IAQmha1s-unsplash .jpg" alt="" />
                <div className="absolute top-0 group hover:backdrop-blur-sm w-full h-full flex justify-center items-center transition-all ease-in">
                    <Link to={'/women'} ><button className="hidden group-hover:block px-4 py-2 bg-neutral-900 rounded-md text-white">Women</button></Link>
                </div>
            </div>
        </div>
    )
}

export default SelectGender