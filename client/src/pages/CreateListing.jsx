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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 text-gray-900">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="absolute -left-10 top-10 h-36 w-36 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative overflow-hidden rounded-[36px] border border-gray-200 bg-white shadow-[0_40px_120px_rgba(0,0,0,0.1)] backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20" />
          <div className="relative p-8 sm:p-10 lg:p-12">
            <div className="text-center mb-10">
              <p className="text-sm uppercase tracking-[0.4em] text-indigo-600/70">Create a listing</p>
              <h1 className="mt-4 text-4xl font-extrabold text-gray-900 sm:text-5xl">List your property in style</h1>
              <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                Add your home with confidence using our beautiful listing builder — upload photos, set pricing, and publish your offer in a few clicks.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
              <section className="space-y-6 rounded-[28px] border border-gray-200 bg-white p-6 shadow-2xl backdrop-blur-xl">
                <div className="space-y-3">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Listing title</label>
                  <input
                    type="text"
                    placeholder="Modern apartment in city center"
                    id="name"
                    maxLength="62"
                    minLength="10"
                    required
                    onChange={handleChange}
                    value={formData.name}
                    className="w-full rounded-3xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe your property highlights"
                    value={formData.description}
                    onChange={handleChange}
                    className="min-h-[180px] w-full rounded-3xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700">Address</label>
                  <input
                    type="text"
                    placeholder="123 Main Street, City"
                    id="address"
                    minLength="10"
                    required
                    onChange={handleChange}
                    value={formData.address}
                    className="w-full rounded-3xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    id="sale"
                    onClick={handleChange}
                    className={`rounded-3xl border px-5 py-4 text-left transition ${formData.type === 'sale' ? 'border-purple-500 bg-purple-500/15 text-purple-200 shadow-lg shadow-purple-500/10' : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400 hover:bg-gray-100'}`}
                  >
                    <p className="font-semibold">Sell</p>
                    <span className="text-sm text-gray-500">List for sale</span>
                  </button>
                  <button
                    type="button"
                    id="rent"
                    onClick={handleChange}
                    className={`rounded-3xl border px-5 py-4 text-left transition ${formData.type === 'rent' ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200 shadow-lg shadow-indigo-500/10' : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400 hover:bg-gray-100'}`}
                  >
                    <p className="font-semibold">Rent</p>
                    <span className="text-sm text-gray-500">List for rent</span>
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <label htmlFor="bedrooms" className="block text-sm font-semibold text-gray-700">Bedrooms</label>
                    <input
                      type="number"
                      id="bedrooms"
                      min="1"
                      max="10"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      className="w-full rounded-3xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="bathrooms" className="block text-sm font-semibold text-gray-700">Bathrooms</label>
                    <input
                      type="number"
                      id="bathrooms"
                      min="1"
                      max="10"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      className="w-full rounded-3xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <label htmlFor="regularPrice" className="block text-sm font-semibold text-gray-700">Regular Price</label>
                    <input
                      type="number"
                      id="regularPrice"
                      min="50"
                      max="10000000"
                      value={formData.regularPrice}
                      onChange={handleChange}
                      className="w-full rounded-3xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                    />
                    {formData.type === 'rent' && <p className="text-sm text-gray-500">per month pricing</p>}
                  </div>

                  {formData.offer && (
                    <div className="space-y-3">
                      <label htmlFor="discountPrice" className="block text-sm font-semibold text-gray-700">Discount Price</label>
                      <input
                        type="number"
                        id="discountPrice"
                        min="0"
                        max="10000000"
                        value={formData.discountPrice}
                        onChange={handleChange}
                        className="w-full rounded-3xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                      />
                      {formData.type === 'rent' && <p className="text-sm text-gray-500">per month pricing</p>}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    id="parking"
                    onClick={handleChange}
                    className={`rounded-3xl border px-5 py-4 text-left transition ${formData.parking ? 'border-emerald-500 bg-emerald-500/15 text-emerald-200 shadow-lg shadow-emerald-500/10' : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400 hover:bg-gray-100'}`}
                  >
                    <p className="font-semibold">Parking</p>
                    <span className="text-sm text-gray-500">{formData.parking ? 'Enabled' : 'Disabled'}</span>
                  </button>
                  <button
                    type="button"
                    id="furnished"
                    onClick={handleChange}
                    className={`rounded-3xl border px-5 py-4 text-left transition ${formData.furnished ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200 shadow-lg shadow-indigo-500/10' : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400 hover:bg-gray-100'}`}
                  >
                    <p className="font-semibold">Furnished</p>
                    <span className="text-sm text-gray-500">{formData.furnished ? 'Yes' : 'No'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  id="offer"
                  onClick={handleChange}
                  className={`w-full rounded-full px-6 py-4 font-semibold transition ${formData.offer ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {formData.offer ? 'Offer enabled' : 'Enable offer'}
                </button>
              </section>

              <aside className="space-y-6 rounded-[28px] border border-gray-200 bg-white p-6 shadow-2xl backdrop-blur-xl">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Images</h2>
                  <p className="mt-2 text-sm text-gray-600">Upload up to 6 property photos. The first image is used as the cover.</p>
                </div>

                <div className="space-y-4">
                  <label className="flex cursor-pointer items-center justify-between rounded-3xl border border-dashed border-gray-400 bg-gray-50 px-5 py-4 text-gray-700 transition hover:border-indigo-400 hover:bg-gray-100">
                    <span>{files.length > 0 ? `${files.length} selected` : 'Choose images'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setFiles(Array.from(e.target.files))}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleFileUpload}
                    disabled={loadingProgress}
                    className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/20 transition hover:brightness-110 disabled:opacity-70"
                  >
                    {loadingProgress ? 'Uploading images...' : 'Upload images'}
                  </button>

                  {imageUploadError && <p className="rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-600">{imageUploadError}</p>}

                  <div className="grid gap-3">
                    {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                      <div key={url} className="flex items-center justify-between rounded-3xl border border-gray-300 bg-gray-50 p-3">
                        <img className="h-20 w-20 rounded-3xl object-cover" src={url} alt={`Listing ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500 hover:text-white"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={formloading || loadingProgress}
                  className="w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-purple-500/20 transition hover:brightness-110 disabled:opacity-70"
                >
                  {formloading ? 'Creating listing...' : 'Create listing'}
                </button>

                {SubmitError && (
                  <p className="rounded-3xl bg-red-500/10 px-4 py-3 text-center text-sm text-red-600">{SubmitError}</p>
                )}
              </aside>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
