import { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
// Swiper core and required modules
import { Swiper, SwiperSlide } from "swiper/react";
import {FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare} from 'react-icons/fa';
import SwiperCore from 'swiper';
// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Optional modules
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useSelector } from 'react-redux';
import Contact from "../components/Contact";

export default function Listing() {
    SwiperCore.use(Navigation)
    const params = useParams();
    const [listData, setListData] = useState(null);
    const [isCopied ,setIsCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const {currentUser} = useSelector((state)=>state.user);
    const [contact, setContact] = useState(false);
    console.log("listData = ",listData);

    useEffect(()=>{

        const fetchListing = async()=>{
            const listID = params.listingID;
            // console.log("listID = ",listID);

            try {
                setLoading(true);

                const res = await fetch(`/api/listing/get/${listID}`);
                const data = await res.json();
                if(data.success ===false){
                    console.log(data.message);
                    setError(data.message)
                    setLoading(false);
                    return;
                }
                setListData(data)
                setLoading(false);

            } catch (error) {
                console.log(error.message);
                setError(error.message);
            }


        }
        fetchListing();

    },[params.listingID])


  return (
    <main>
        {loading && <p className="text-center text-2xl my-7">Loading...</p>}
        {error && <p className="text-center text-2xl my-7">Something went wrong!</p>}


        {
          listData && !loading && !error &&(

            <div>
                <Swiper navigation>
                        {
                            listData.imageUrls.map((url)=>{
                                return <SwiperSlide key={url}>
                                    <div className="h-[550px]" style={{background:`url(${url}) center no-repeat`,backgroundSize:'cover'}}>

                                    </div>

                                </SwiperSlide>

                            })
                        }
                </Swiper>
                <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
                    <FaShare className="text-slate-500"
                    onClick={()=>{
                        navigator.clipboard.writeText(window.location.href);
                        setIsCopied(true);
                    }}
                    />
                </div>
                {
                    isCopied && setTimeout(()=>{
                        setIsCopied(false);
                    },2000) && (<p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">Link copied!</p>)
                }
                <div className="flex flex-col max-w-4xl mx-auto p-3 my-6 gap-6">
                    <p className="text-2xl font-semibold">{listData.name} - $ {''}{listData.offer ? Number(listData?.discountPrice).toLocaleString('en-US') : Number(listData?.regularPrice).toLocaleString('en-US')} {listData.type === 'rent' && '/ month'}</p> 

                    <p className="flex items-center mt-6 gap-2 text-slate-600 my-2 text-sm">
                        <FaMapMarkerAlt className="text-green-700"/> {listData.address}
                    </p>
                    <div className="flex gap-4">
                        <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                            {listData.type=='rent'?'For Rent':'For Sale'}
                        </p>
                        {
                            listData.offer && (
                                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">$ {+listData.regularPrice - +listData.discountPrice} Discount</p>
                            )
                        }
                    </div>
                    
                <p className="text-slate-800"> <span className="font-semibold text-black">Description - {' '}</span>{listData.description}</p>

                <ul className="text-green-900 font-semibold text-sm flex items-center gap-4 sm:gap-6 flex-wrap">
                    <li className="flex items-center gap-1 whitespace-nowrap">
                        <FaBed className="text-lg"/> 
                        {listData.bedrooms > 1 ? `${listData.bedrooms} beds`: `${listData.bedrooms} bed`}
                    </li>

                    <li className="flex items-center gap-1 whitespace-nowrap">
                        <FaBath className="text-lg"/> 
                        {listData.bathrooms > 1 ? `${listData.bathrooms} baths`: `${listData.bathrooms} bath`}
                    </li>

                    <li className="flex items-center gap-1 whitespace-nowrap">
                        <FaParking className="text-lg"/> 
                        {listData.parking ? `Parking`: `No Parking`}
                    </li>

                    <li className="flex items-center gap-1 whitespace-nowrap">
                        <FaChair className="text-lg"/> 
                        {listData.furnished ? `Furnished`: `Unfurnished`}
                    </li>

                </ul>
                {
                    currentUser && listData.userRef!==currentUser._id && !contact && (
                        <button onClick={()=>setContact(true)} className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3">Contact Landlord</button>
                    )
                }
                {
                    contact ? <Contact listing={listData}/>:null
                }

                



                </div>

                

            </div>
          )
            

        }


    </main>
  )
}
