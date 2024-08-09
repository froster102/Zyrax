import React from 'react'
import { IoMdClose } from 'react-icons/io'
import _ from 'lodash'

function ViewModal({ user, product, category, closeModal }) {
    return (
        <>
            {user && <div className="relative z-10" aria-labelledby="crop-image-dialog">
                <div className="fixed inset-0 bg-[#f1f1f1] bg-opacity-75 transition-all backdrop-blur-sm"></div>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full justify-center items-center px-2 py-12 text-center ">
                        <div className="relative w-96 text-left p-10 rounded-2xl bg-[#D9D9D9] flex justify-center text-black `">
                            <button
                                className="rounded-md p-1 inline-flex items-center justify-center text-black hover:bg-black hover:text-white transition ease-in duration-75 focus:outline-none absolute top-2 right-2"
                                onClick={closeModal} >
                                <IoMdClose size={20} />
                            </button>
                            <p>
                                <span className='font-semibold'>First Name :</span> {user?.firstName}
                                <br />
                                <span className='font-semibold'>Last Name :</span> {user?.lastName}
                                <br />
                                <span className='font-semibold'>Email :</span> {user?.email}
                                <br />
                                <span className='font-semibold'>Verification Status :</span> {user?.verification_status?.toString()}
                                <br />
                                <span className='font-semibold'>Active Status :</span> {user?.status}
                            </p>
                        </div>
                    </div>
                </div>
            </div>}
            {
                product && <div className="relative z-10" aria-labelledby="crop-image-dialog">
                    <div className="fixed inset-0 bg-[#f1f1f1] bg-opacity-75 transition-all backdrop-blur-sm"></div>
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full justify-center items-center px-2 py-12 text-center ">
                            <div className="relative w-96 text-left p-10 rounded-2xl bg-[#D9D9D9] flex justify-center text-black `">
                                <button
                                    className="rounded-md p-1 inline-flex items-center justify-center text-black hover:bg-black hover:text-white transition ease-in duration-75 focus:outline-none absolute top-2 right-2"
                                    onClick={closeModal} >
                                    <IoMdClose size={20} />
                                </button>
                                <p>
                                    First Name : {user?.firstName}
                                    <br />
                                    Last Name : {user?.lastName}
                                    <br />
                                    Email : {user?.email}
                                    <br />
                                    Verification Status : {user?.verification_status?.toString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                category && <div className="relative z-10" aria-labelledby="crop-image-dialog">
                    <div className="fixed inset-0 bg-[#f1f1f1] bg-opacity-75 transition-all backdrop-blur-sm"></div>
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full justify-center items-center px-2 py-12 text-center ">
                            <div className="relative w-96 text-left p-10 rounded-2xl bg-[#D9D9D9] flex justify-center text-black `">
                                <button
                                    className="rounded-md p-1 inline-flex items-center justify-center text-black hover:bg-black hover:text-white transition ease-in duration-75 focus:outline-none absolute top-2 right-2"
                                    onClick={closeModal} >
                                    <IoMdClose size={20} />
                                </button>
                                <p>
                                    <span className='font-semibold'>Category Name</span> : {_.startCase(category?.name)}
                                    <br />
                                    <span className='font-semibold'>Description</span> : {_.startCase(category?.description)}
                                    <br />
                                    {
                                        category.parent === null
                                            ? <><span className='font-semibold'>Category Type : Parent</span>
                                                <div className='flex'>
                                                    <span className='block font-semibold'>Sub Categories : </span>
                                                    <ul className='ml-1'>
                                                        {category.children.map((child, i) => {
                                                            return <li key={i}>{_.startCase(child.name)}</li>
                                                        })}
                                                    </ul>
                                                </div>
                                            </>
                                            : <>
                                                <span className='font-semibold block'>Category Type : <span className='font-normal'>Sub Category</span> </span>
                                                <span className='font-semibold'>Parent Category :</span> <span className='inline'>{_.startCase(category.parent.name)}</span>
                                            </>
                                    }

                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default ViewModal