import { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
// Swiper core and required modules
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from 'swiper';
// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Optional modules
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export default function Listing() {
    SwiperCore.use(Navigation)
    const params = useParams();
    const [listData, setListData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
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

            </div>
          )
            

        }


    </main>
  )
}
