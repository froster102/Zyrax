import React from 'react'
import ReturnPng from '../assets/30-days.png'
import Cash from '../assets/cash-on-delivery.png'
import Phonepe from '../assets/phonepe-icon.png'
import Gpay from '../assets/google-pay-icon.png'
import MasterCard from '../assets/master-card-icon.png'
import AmazonPay from '../assets/amazon-pay-icon.png'
import Paytm from '../assets/paytm-icon.png'
import Mobiwik from '../assets/mobikwik-logo-icon.png'
import Dtdc from '../assets/dtdc-logo.png'
import Delhivery from '../assets/delhivery-logo.png'
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { BsTwitterX } from 'react-icons/bs';

function Footer() {
    return (
        <>
            <div className='bg-stone-200 rounded-t-3xl'>
                <div className='w-full grid grid-cols-12  p-6 mt-16'>
                    <div className='sm:col-start-3 sm:col-end-5 col-start-2 col-end-5'>
                        <h1 className='sm:text-lg text-sm font-semibold'>Need Help</h1>
                        <ul>
                            <li className='sm:text-sm text-xs'>Contact Us</li>
                            <li className='sm:text-sm text-xs'>Track Order</li>
                            <li className='sm:text-sm text-xs'>Return and Refund</li>
                            <li className='sm:text-sm text-xs'>FAQs</li>
                            <li className='sm:text-sm text-xs'>My Account</li>

                        </ul>
                    </div>
                    <div className='sm:col-start-5 sm:col-end-7 col-start-5 col-end-8'>
                        <h1 className='sm:text-lg text-sm font-semibold'>More Info</h1>
                        <ul>
                            <li className='sm:text-sm text-xs'>T&C</li>
                            <li className='sm:text-sm text-xs'>Privacy Policy</li>
                            <li className='sm:text-sm text-xs'>Sitemap</li>
                        </ul>
                    </div>
                    <div className='sm:col-start-7 sm:col-end-10 col-start-8 col-end-12'>
                        <h1 className='sm:text-lg text-sm font-semibold'>Company</h1>
                        <ul>
                            <li className='sm:text-sm text-xs'>About Us</li>
                            <li className='sm:text-sm text-xs'>Careers</li>
                            <li className='sm:text-sm text-xs'>Community Initiatives</li>
                            <li className='sm:text-sm text-xs'>FAQs</li>
                            <li className='sm:text-sm text-xs'>My  Account</li>
                        </ul>
                    </div>
                    <div className='sm:col-start-3 mt-6 sm:col-end-10 col-start-2 col-end-12'>
                        <div className='flex justify-between'>
                            <div>
                                <div className='flex'>
                                    <img className='w-[16px] h-[16px]' src={ReturnPng} alt="30 day return" />
                                    <span className='text-xs font-extralight ml-2'>30 days easy returns</span>
                                </div>
                                <div className='flex mt-2'>
                                    <img className='w-[16px] h-[16px]' src={Cash} alt="cash on delivery" />
                                    <span className='text-xs font-extralight ml-2'>COD available</span>
                                </div>
                            </div>
                            <div className='flex'>
                                <FaInstagram className='ml-2 sm:w-[30px] sm:h-[30px] w-[18px] h-[18px]'></FaInstagram>
                                <FaFacebook className='ml-2 sm:w-[30px] sm:h-[30px] w-[18px] h-[18px]'></FaFacebook>
                                <BsTwitterX className='ml-2 sm:w-[30px] sm:h-[30px] w-[18px] h-[18px]'></BsTwitterX>
                            </div>
                        </div>
                        <div></div>

                    </div>
                </div>
                <div className='flex justify-center items-center mt-2'>
                    <p className='font-extralight sm:text-sm text-[6px]'>100% Secure Payment:</p>
                    <div className='flex justify-center items-center gap-2 ml-2'>
                        <img className='sm:w-[20px] sm:h-[20px] w-[10px] h-[10px] ' src={Phonepe} alt="phonepe" />
                        <img className='sm:w-[23px] sm:h-[20px] w-[13px] h-[10px]' src={Gpay} alt="google pay" />
                        <img className='sm:w-[23px] sm:h-[20px] w-[13px] h-[10px]' src={MasterCard} alt="master card" />
                        <img className='sm:w-[43px] sm:h-[8px] w-[33px] h-[4px]' src={AmazonPay} alt="amazon pay" />
                        <img className='sm:w-[21px] sm:h-[6px] w-[11px] h-[3px]' src={Paytm} alt="paytm" />
                        <img className='sm:w-[18px] sm:h-[12px] w-[8px] h-[12px]' src={Mobiwik} alt="mobiwik" />
                        <img className='sm:w-[15px] sm:h-[12px] w-[5px]' src={Cash} alt="cash on delivery" />
                    </div>
                    <p className='mx-2'>|</p>
                    <p className='font-extralight sm:text-sm text-[6px]'>Shipping Partners: </p>
                    <div className='flex justify-center items-center gap-2 ml-2'>
                        <img className='sm:w-[61px] sm:h-[14px] w-[41px] h-[10px]' src={Dtdc} alt="Dtdc" />
                        <img className='sm:w-[86px] sm:h-[13px] w-[43px] ' src={Delhivery} alt="delhivery" />
                    </div>
                </div>
                <p className='text-center font-bold text-xs mt-16'>© The Zyrax Store 2024-25</p>
            </div>


        </>
    )
}

export default Footer