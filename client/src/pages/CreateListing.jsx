import { useState } from "react"
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
export default function CreateListing() {
  const {currentUser} = useSelector(state=>state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [SubmitError, setFormError]  = useState(false)
  const [formloading, setFormloading] = useState(false);
  console.log("files = ",files);

  const [formData, setFormData] = useState({
  imageUrls: [],
  name:'',
  description:'',
  address:'',
  regularPrice:50,
  discountPrice:0,
  bathrooms:1,
  bedrooms:1,
  furnished:false,
  parking:false,
  type:'rent',
  offer:false
});

console.log("formData = ",formData);

const handleFileUpload = async () => {
  if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
    setLoadingProgress(true);
    setImageUploadError(false);

     // check karenge ki sabhi files ka type "image/*" ho
    const isAllImages = files.every((file) => file.type.startsWith("image/"));

    if (!isAllImages) {
      setLoadingProgress(false);
      setImageUploadError("❌ Only image files are allowed!");
      return; // stop upload
    }





    try {
      // Sabhi upload ke promises collect
      const promises = files.map((file) => StoreImage(file));

      // Parallel upload
      const urls = await Promise.all(promises);

      console.log("All uploaded image URLs:", urls);

      // ✅ State update karna (pehle ke images bhi preserve karna ho toh spread karo)
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));
      setImageUploadError(false);
      setLoadingProgress(false);
    } catch (error) {
      setImageUploadError("Error uploading files:", error);
      setLoadingProgress(false);
      console.error("Error uploading files:", error);
    }
  }else{
    setImageUploadError('You can only upload 6 images!');
  }
};

const StoreImage = async (Uploadedfile) => {
  const data = new FormData();
  data.append("file", Uploadedfile);
  data.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
  const cloud_name = import.meta.env.VITE_CLOUD_NAME;
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    {
      method: "POST",
      body: data,
    }
  );

  const uploadedImage = await res.json();
  return uploadedImage.secure_url;
};

const handleRemoveImage = (index)=>{
  console.log("Image index = ",index);

  setFormData({
    ...formData,
    imageUrls:formData.imageUrls.filter((_,i)=> i!== index),
  });

}
const handleChange = (e) =>{

  if(e.target.id =='sale' || e.target.id=='rent'){
    setFormData({
      ...formData,
      type:e.target.id
    })
  }

  if(e.target.id =="parking" || e.target.id=="furnished" || e.target.id=="offer"){
    setFormData({
      ...formData,
      [e.target.id]:!formData[e.target.id]
    })
  }
  if(e.target.type=="number" || e.target.type=="text" || e.target.type=="textarea"){
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }


}
const handleSubmit = async(e)=>{
  e.preventDefault();

  if(formData.imageUrls.length < 1) return setFormError('You must upload atleast one image!')
  
  if(+formData.regularPrice < +formData.discountPrice) return setFormError('Discount price must be lower than regular price')


  try {
      setFormloading(true);
      setFormError(false);
    const res = await fetch("/api/listing/create",{
      method:"POST",
      headers:{
        'Content-Type':"application/json",
      },
      body:JSON.stringify({...formData,userRef:currentUser._id}),
    })
    const data = await res.json();
    if(data === false){
        setFormError(data.message);
        setFormloading(false);
        return;
    }
    setFormloading(false);
    navigate(`/listing/${data._id}`);
    
  } catch (error) {
      setFormError(error.message);
      setFormloading(false);
  }


}
console.log("SubmitError = ",SubmitError);

  return (
    <main className="max-w-4xl p-3 mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col gap-4 flex-1">
                <input type="text" placeholder="Name" className="p-3 rounded-lg bg-white" id="name" maxLength="62" minLength='10' required onChange={handleChange} value={formData.name}/>
                <textarea value={formData.description} onChange={handleChange} name="description" id="description" placeholder="Description" className="p-3 rounded-lg bg-white"></textarea>
                <input type="text" placeholder="Address" className="p-3 rounded-lg bg-white" id="address" minLength='10' required onChange={handleChange} value={formData.address}/>

                <div className="flex gap-6 flex-wrap">
                    <div className="flex gap-2">
                        <input type="checkbox" id="sale" className="w-5" onChange={handleChange} checked={formData.type =='sale'}  />
                        <span>Sell</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="rent" className="w-5" onChange={handleChange} checked={formData.type =='rent'} />
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="parking" className="w-5" onChange={handleChange} checked={formData.parking ==true}/>
                        <span>Parking spot</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="furnished" className="w-5"  onChange={handleChange} checked={formData.furnished ==true}/>
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="offer" className="w-5" onChange={handleChange} checked={formData.offer ==true}/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex gap-6 flex-wrap">
                  <div className="flex gap-2 items-center">
                        <input type="number" name="bedrooms" min="1" max="10" id="bedrooms" className="p-3 bg-white border-gray-300 border rounded-lg" onChange={handleChange} value={formData.bedrooms}/>
                        <p>Beds</p>
                  </div>

                  <div className="flex gap-2 items-center">
                        <input type="number" name="bathrooms" min="1" max="10" id="bathrooms" className="p-3 bg-white border-gray-300 border rounded-lg" onChange={handleChange} value={formData.bathrooms}/>
                        <p>Baths</p>
                  </div>

                  <div className="flex gap-2 items-center">
                        <input type="number" name="regularPrice" min="50" max="10000" id="regularPrice" className="p-3 bg-white border-gray-300 border rounded-lg" onChange={handleChange} value={formData.regularPrice}/>
                        <div className="flex flex-col items-center">
                          <p>Regular price</p>
                          <span className="text-sm">($ / month)</span>
                        </div>
                  </div>
                  {
                    formData.offer
                    ?
                    (<div className="flex gap-2 items-center">
                        <input type="number" name="discountPrice" min="0" max="10000" id="discountPrice" className="p-3 bg-white border-gray-300 rounded-lg" onChange={handleChange} value={formData.discountPrice}/>
                        <div className="flex flex-col items-center">
                          <p>Descounted price</p>
                          <span className="text-sm">($ / month)</span>
                        </div>
                  </div>)
                    :
                    null
                  }
                  

                </div>

            </div>
            <div className="flex flex-col flex-1 gap-4">
                <p className="font-semibold"> Images: 
                  <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max: 6)</span>
                </p>
                <div className="flex gap-4">
                  <input onChange={(e)=>setFiles(Array.from(e.target.files))} className="p-3 border border-gray-300 rounded w-full" type="file" name="images" id="images" accept="image/*" multiple />
                  <button disabled={loadingProgress} onClick={handleFileUpload} type="button" className="p-3 text-green-700 border-green-700 border rounded uppercase hover:shadow-lg disabled:opacity-80">
                    {
                      loadingProgress? 'Uploading...':'upload'
                    }
                  </button>
                </div>
            <p className="text-red-700 text-sm">
              {
                imageUploadError? imageUploadError:''
              }
            </p>
            
              {
                formData.imageUrls.length > 0 
              ?
              (
                formData.imageUrls.map((url,index)=>{
                    return <div key={url} className="flex justify-between p-3 border border-gray-200 items-center rounded-lg">
                      <img className="w-20 h-20 object-contain rounded-lg" src={url} alt="listing image"/>
                      <button type="button" onClick={()=>handleRemoveImage(index)} className="uppercase text-red-700 p-2 rounded-lg border border-red-400 hover:opacity-65 hover:bg-red-600 hover:text-white">Delete</button>
                    </div>
                })
              )
              : null
              }


                <button disabled={formloading || loadingProgress} className="bg-slate-700 uppercase p-3 rounded-lg text-white hover:opacity-95 disabled:opacity-80">{
                  formloading?'Creating...':'Create listing'
              }</button>
              <p className="text-red-700 text-center text-sm">
                {
                  SubmitError ? SubmitError :''
                }
              </p>
            </div>
        </form>
    </main>
  )
}
