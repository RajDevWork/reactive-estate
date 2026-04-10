import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  console.log("files = ", files);

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

useEffect(() => {
  const fetchListing = async () => {
    const listingID = params.listingID;
    if (!listingID) return;

    try {
      const res = await fetch(`/api/listing/get/${listingID}`);
      const data = await res.json();
      if (data.success === false) {
        setSubmitError(data.message || "Unable to load listing.");
        return;
      }

      setFormData({
        imageUrls: data.imageUrls || [],
        name: data.name || "",
        description: data.description || "",
        address: data.address || "",
        regularPrice: data.regularPrice || 50,
        discountPrice: data.discountPrice || 0,
        bathrooms: data.bathrooms || 1,
        bedrooms: data.bedrooms || 1,
        furnished: data.furnished || false,
        parking: data.parking || false,
        type: data.type || "rent",
        offer: data.offer || false,
      });
    } catch (error) {
      setSubmitError(error.message || "Could not load listing.");
    }
  };

  fetchListing();
}, [params.listingID]);

const handleFileUpload = async () => {
  if (files.length < 1) {
    setImageUploadError("Select images to upload.");
    return;
  }

  if (files.length + formData.imageUrls.length > 6) {
    setImageUploadError("You can only upload up to 6 images.");
    return;
  }

  setLoadingProgress(true);
  setImageUploadError("");

  const isAllImages = files.every((file) => file.type.startsWith("image/"));
  if (!isAllImages) {
    setLoadingProgress(false);
    setImageUploadError("❌ Only image files are allowed!");
    return;
  }

  try {
    const urls = await Promise.all(files.map((file) => StoreImage(file)));
    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ...urls],
    }));
    setFiles([]);
    setImageUploadError("");
  } catch (error) {
    setImageUploadError("Error uploading images. Please try again.");
    console.error("Error uploading files:", error);
  } finally {
    setLoadingProgress(false);
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

const handleRemoveImage = (index) => {
  setFormData({
    ...formData,
    imageUrls: formData.imageUrls.filter((_, i) => i !== index),
  });
};

const handleChange = (e) => {
  if (e.target.id === "sale" || e.target.id === "rent") {
    setFormData({
      ...formData,
      type: e.target.id,
    });
    return;
  }

  if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
    setFormData({
      ...formData,
      [e.target.id]: !formData[e.target.id],
    });
    return;
  }

  const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
  setFormData({
    ...formData,
    [e.target.id]: value,
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitError("");

  if (formData.imageUrls.length < 1) {
    setSubmitError("You must upload at least one image.");
    return;
  }

  if (+formData.regularPrice < +formData.discountPrice) {
    setSubmitError("Discount price must be lower than regular price.");
    return;
  }

  try {
    setFormLoading(true);
    const res = await fetch(`/api/listing/update/${params.listingID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, userRef: currentUser._id }),
    });
    const data = await res.json();
    if (data.success === false) {
      setSubmitError(data.message || "Failed to update listing.");
      setFormLoading(false);
      return;
    }
    setFormLoading(false);
    navigate(`/listing/${data._id}`);
  } catch (error) {
    setSubmitError(error.message || "Update failed.");
    setFormLoading(false);
  }
};

console.log("submitError = ", submitError);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 text-gray-900">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="absolute -left-10 top-10 h-36 w-36 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative overflow-hidden rounded-[36px] border border-gray-200 bg-white shadow-[0_40px_120px_rgba(0,0,0,0.1)] backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20" />
          <div className="relative p-8 sm:p-10 lg:p-12">
            <div className="text-center mb-10">
              <p className="text-sm uppercase tracking-[0.4em] text-indigo-600/70">Update Listing</p>
              <h1 className="mt-4 text-4xl font-extrabold text-gray-900 sm:text-5xl">Refresh your property details</h1>
              <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                Update your listing with fresh photos, pricing, and features in one polished workflow.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
              <section className="space-y-6 rounded-[28px] border border-gray-200 bg-white p-6 shadow-2xl backdrop-blur-xl">
                <div className="space-y-3">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Listing title</label>
                  <input
                    id="name"
                    type="text"
                    maxLength="62"
                    minLength="10"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Modern downtown apartment"
                    className="w-full rounded-3xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Property description</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the best features of this home"
                    className="min-h-[180px] w-full rounded-3xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700">Address</label>
                  <input
                    id="address"
                    type="text"
                    minLength="10"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main Street, City"
                    className="w-full rounded-3xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    id="sale"
                    onClick={handleChange}
                    className={`rounded-3xl border px-5 py-4 text-left transition ${formData.type === "sale" ? 'border-purple-500 bg-purple-500/15 text-purple-200 shadow-lg shadow-purple-500/10' : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400 hover:bg-gray-100'}`}
                  >
                    <p className="font-semibold">Sell</p>
                    <span className="text-sm text-gray-500">List this home for sale</span>
                  </button>
                  <button
                    type="button"
                    id="rent"
                    onClick={handleChange}
                    className={`rounded-3xl border px-5 py-4 text-left transition ${formData.type === "rent" ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200 shadow-lg shadow-indigo-500/10' : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400 hover:bg-gray-100'}`}
                  >
                    <p className="font-semibold">Rent</p>
                    <span className="text-sm text-gray-500">List this home for rent</span>
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <label htmlFor="bedrooms" className="block text-sm font-semibold text-gray-700">Bedrooms</label>
                    <input
                      id="bedrooms"
                      type="number"
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
                      id="bathrooms"
                      type="number"
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
                    <label htmlFor="regularPrice" className="block text-sm font-semibold text-gray-700">Regular price</label>
                    <input
                      id="regularPrice"
                      type="number"
                      min="50"
                      max="10000000"
                      value={formData.regularPrice}
                      onChange={handleChange}
                      className="w-full rounded-3xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                    />
                    {formData.type === "rent" && <p className="text-sm text-gray-500">per month</p>}
                  </div>

                  {formData.offer && (
                    <div className="space-y-3">
                      <label htmlFor="discountPrice" className="block text-sm font-semibold text-gray-700">Discount price</label>
                      <input
                        id="discountPrice"
                        type="number"
                        min="0"
                        max="10000000"
                        value={formData.discountPrice}
                        onChange={handleChange}
                        className="w-full rounded-3xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                      />
                      {formData.type === "rent" && <p className="text-sm text-gray-500">per month</p>}
                    </div>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <button
                    type="button"
                    id="parking"
                    onClick={handleChange}
                    className={`rounded-3xl border px-5 py-4 text-left transition ${formData.parking ? 'border-emerald-500 bg-emerald-500/15 text-emerald-200 shadow-lg shadow-emerald-500/10' : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400 hover:bg-gray-100'}`}
                  >
                    <p className="font-semibold">Parking</p>
                    <span className="text-sm text-gray-500">{formData.parking ? "Included" : "Add parking"}</span>
                  </button>
                  <button
                    type="button"
                    id="furnished"
                    onClick={handleChange}
                    className={`rounded-3xl border px-5 py-4 text-left transition ${formData.furnished ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200 shadow-lg shadow-indigo-500/10' : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400 hover:bg-gray-100'}`}
                  >
                    <p className="font-semibold">Furnished</p>
                    <span className="text-sm text-gray-500">{formData.furnished ? "Yes" : "No"}</span>
                  </button>
                  <button
                    type="button"
                    id="offer"
                    onClick={handleChange}
                    className={`rounded-3xl border px-5 py-4 text-left transition ${formData.offer ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400 hover:bg-gray-100'}`}
                  >
                    <p className="font-semibold">Offer</p>
                    <span className="text-sm text-gray-500">{formData.offer ? "Active" : "Add discount"}</span>
                  </button>
                </div>
              </section>

              <aside className="space-y-6 rounded-[28px] border border-gray-200 bg-white p-6 shadow-2xl backdrop-blur-xl">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Photos</h2>
                  <p className="mt-2 text-sm text-gray-600">Upload up to 6 property photos. First image becomes cover.</p>
                </div>

                <div className="space-y-4">
                  <label className="flex cursor-pointer items-center justify-between rounded-3xl border border-dashed border-gray-400 bg-gray-50 px-5 py-4 text-gray-700 transition hover:border-indigo-400 hover:bg-gray-100">
                    <span>{files.length > 0 ? `${files.length} selected` : "Choose images"}</span>
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
                    className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/20 transition hover:brightness-110 disabled:opacity-70"
                  >
                    {loadingProgress ? "Uploading images..." : "Upload images"}
                  </button>

                  {imageUploadError && <p className="rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-600">{imageUploadError}</p>}

                  <div className="grid gap-3">
                    {formData.imageUrls.length > 0 &&
                      formData.imageUrls.map((url, index) => (
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
                  disabled={formLoading || loadingProgress}
                  className="w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-purple-500/20 transition hover:brightness-110 disabled:opacity-70"
                >
                  {formLoading ? "Updating listing..." : "Update listing"}
                </button>

                {submitError && (
                  <p className="rounded-3xl bg-red-500/10 px-4 py-3 text-center text-sm text-red-600">{submitError}</p>
                )}
              </aside>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
