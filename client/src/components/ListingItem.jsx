import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md';

export default function ListingItem({listing}) {
    console.log()
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[300px]'>
        <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt="listing cover" 
            className='h-[320px] w-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
            />
            <div className='p-3 flex flex-col gap-2 w-full'>
                <p className='truncate text-lg font-semibold text-slate-700'>{listing.name}</p>
            </div>
            <div className='p-3 flex items-center gap-1'>
                <MdLocationOn  className='w-4 h-4 text-green-700'/>
                <p className='truncate text-gray-600'>{listing.address}</p>
            </div>
            <div className='p-3'>
                <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
                <p className='text-slate-500 font-semibold mt-2'>
                   $ {listing.offer 
  ? Number(listing?.discountPrice).toLocaleString('en-IN') 
  : Number(listing?.regularPrice).toLocaleString('en-IN')}

                    {
                        listing.type =='rent' && ' / month'
                    }
                </p>
                <div className='text-slate-700 flex gap-4'>
                    <div className='font-bold text-xs'>
                        {
                            listing.bathrooms > 1 ?`${listing.bathrooms} Baths`:`${listing.bathrooms} Bath`
                        }
                    </div>
                    <div className='font-bold text-xs'>
                        {
                            listing.bedrooms > 1 ?`${listing.bedrooms} Beds`:`${listing.bedrooms} Bed`
                        }
                    </div>
                </div>
            </div>
        </Link>
    </div>
  )
}
