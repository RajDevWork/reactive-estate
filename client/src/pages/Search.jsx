import React from 'react'

export default function Search() {
  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-2 md:border-r-1 md:min-h-screen'>
            <form className='flex flex-col gap-8'>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold'>Search Term: </label>
                    <input type="text" className='border rounded-lg p-3 w-full bg-white' id="searchTerm" placeholder='Search...'/>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Type: </label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="all" className='w-5' />
                        <span>Rent & Sale</span>
                    </div>

                    <div className='flex gap-2'>
                        <input type="checkbox" id="rent" className='w-5' />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="sale" className='w-5' />
                        <span>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="offer" className='w-5' />
                        <span>Offer</span>
                    </div>
                </div>

                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Aminities: </label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="parking" className='w-5' />
                        <span>Parking</span>
                    </div>

                    <div className='flex gap-2'>
                        <input type="checkbox" id="furnished" className='w-5' />
                        <span>Furnished</span>
                    </div>
                </div>

                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Sort: </label>
                    <select name="sort_order" id="sort" className='border rounded-lg p-3 bg-white'>
                        <option>Price high to low</option>
                        <option>Price low to high</option>
                        <option>Latest</option>
                        <option>Oldest</option>
                    </select>
                </div>

                <button className='uppercase bg-slate-700 p-3 rounded-lg text-white hover:opacity-95'>Search</button>
            </form>
        </div>
        <div>
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Your Search Result: </h1>
        </div>
    </div>
  )
}
