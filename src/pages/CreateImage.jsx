import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader, Radio } from "../components";

import { generateImageApi, uploadImageApi } from "../api/image.api.js";
import { useApiRefetch } from "../store/useApiRefetch.js";

const CreateImage = () => {
  const [form, setForm] = useState({
    prompt: "",
    model: "dall-e-2",
    quality: "basic",
    size: "256x256",
    style: "simple",
  });

  const [image, setImage] = useState({
    imageId: null,
    imageUrl: preview,
    status: null,
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [savingImg, setSavingImg] = useState(false);
  const setImageSaved = useApiRefetch((state) => state.setImageSaved);

  // Options dynamically change based on selected model (UI)
  const options = {
    model: ["dall-e-2", "dall-e-3"],
    quality: form.model === "dall-e-2" ? ["basic"] : ["standard", "hd"],
    size: form.model === "dall-e-2" ? ["256x256", "512x512", "1024x1024"] : ["1024x1024", "1792x1024", "1024x1792"],
    style: form.model === "dall-e-2" ? ["simple"] : ["natural", "vivid"],
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "model") {
      // Reset form when model changes
      setForm({
        ...form,
        model: value,
        quality: value === "dall-e-2" ? "basic" : "standard",
        size: value === "dall-e-2" ? "256x256" : "1024x1024",
        style: value === "dall-e-2" ? "simple" : "natural",
      });
    } else {
      // Normal update for other fields
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Generate a random prompt
  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm((prev) => ({ ...prev, prompt: randomPrompt }));
  };

  const handleGenerateImage = async () => {
    try {
      if (!form?.prompt) {
        toast.error("Please enter a prompt");
        return;
      }

      setGeneratingImg(true);
      setImage((prev) => ({ ...prev, imageUrl: preview }));
      setForm((prev) => ({ ...prev, prompt: prev.prompt.trim() }));

      const response = await generateImageApi(form);

      if (response?.error) {
        toast.error(response.error);
        setGeneratingImg(false);
        return;
      }

      const { imageId, imageUrl } = response.data;

      if (!imageId || !imageUrl) {
        toast.error("Failed to generate image. Please try again.");
        setGeneratingImg(false);
        return;
      }

      setImage({ imageId, imageUrl, status: "unsaved" });

      // Not setting generatingImg (false) here - image onLoad/onError handles it
    } catch (error) {
      toast.error(error?.message);
      console.error("Error while generating image:", error);
      setGeneratingImg(false);
    }
  };

  const handleSaveImage = async () => {
    try {
      setSavingImg(true);

      if (!image) {
        toast.error("No image data available");
        return;
      }

      if (image.status === "saved") {
        toast.error("Image is already saved");
        return;
      }

      if (!image.imageId?.trim()) {
        toast.error("Image ID is required");
        return;
      }

      if (!image.imageUrl?.trim()) {
        toast.error("Image URL is required");
        return;
      }

      const { status, ...apiPayload } = image;

      const response = await uploadImageApi(apiPayload);

      if (response?.error) {
        toast.error(response.error);
        return;
      }

      setImageSaved(true);
      setImage((prev) => ({ ...prev, status: "saved" }));
      toast.success("Image saved to gallery", { duration: 4000 });
    } catch (error) {
      toast.error(error?.message || "Something went wrong while saving image");
      console.error("Error while saving image:", error);
    } finally {
      setSavingImg(false);
    }
  };

  useEffect(() => {
    // Reset loading state when image URL changes (not on first render with preview)
    if (image.imageUrl && image.imageUrl !== preview) {
      const img = new Image();
      img.src = image.imageUrl;

      img.onload = () => {
        setGeneratingImg(false);
      };

      img.onerror = () => {
        setGeneratingImg(false);
        toast.error("Failed to load generated image");
      };
    }
  }, [image.imageUrl]);

  return (
    <section className="max-w-7xl mx-auto relative">
      <div>
        <h1 className="font-extrabold text-black text-4xl">Create</h1>
        <p className="mt-2 text-gray-600 text-sm">
          Bring your ideas to life! Generate stunning AI images with DALL-E and use them instantly.
        </p>
      </div>

      <form className="mt-16 max-w-5xl">
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="An Impressionist oil painting of sunflowers in a white vase…"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div className="flex md:flex-row flex-col gap-5">
            {/* Display generated image or placeholder */}
            <div className="relative bg-gray-100 border border-gray-300 text-sm rounded-lg p-3 w-64 h-64 flex justify-center items-center">
              <img
                src={image?.imageUrl}
                alt={form?.prompt || "preview image"}
                className="w-full h-full object-contain"
              />

              {generatingImg && (
                <div className="absolute inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                  <Loader />
                </div>
              )}
            </div>

            {/* Image Customization Buttons */}
            <div className={`${(generatingImg || savingImg) && "pointer-events-none"} md:px-4 space-y-3`}>
              <label className="block">
                <span className="font-bold">Model</span>
                <div className="flex flex-wrap gap-2">
                  {options.model.map((value) => (
                    <Radio
                      key={value}
                      name="model"
                      value={value}
                      handleChange={handleChange}
                      selectedValue={form.model}
                    />
                  ))}
                </div>
              </label>

              <label className="block">
                <span className="font-bold">Quality</span>
                <div className="flex flex-wrap gap-2">
                  {options.quality.map((value) => (
                    <Radio
                      key={value}
                      name="quality"
                      value={value}
                      handleChange={handleChange}
                      selectedValue={form.quality}
                    />
                  ))}
                </div>
              </label>

              <label className="block">
                <span className="font-bold">Size</span>
                <div className="flex flex-wrap gap-2">
                  {options.size.map((value) => (
                    <Radio
                      key={value}
                      name="size"
                      value={value}
                      handleChange={handleChange}
                      selectedValue={form.size}
                    />
                  ))}
                </div>
              </label>

              <label className="block">
                <span className="font-bold">Style</span>
                <div className="flex flex-wrap gap-2">
                  {options.style.map((value) => (
                    <Radio
                      key={value}
                      name="style"
                      value={value}
                      handleChange={handleChange}
                      selectedValue={form.style}
                    />
                  ))}
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-4 items-center">
          {/* Generate Image Button */}
          <button
            type="button"
            onClick={handleGenerateImage}
            disabled={savingImg || generatingImg}
            className="font-medium rounded-md text-sm w-full md:w-48 px-5 py-2.5 text-center text-white bg-yellow-500"
          >
            {generatingImg ? "Generating . . ." : "Generate"}
          </button>

          {/* Save Image Button */}
          <button
            type="button"
            onClick={handleSaveImage}
            disabled={!image?.imageId || generatingImg || savingImg}
            className="font-medium rounded-md text-sm w-full md:w-48 px-5 py-2.5 text-center text-white bg-green-700"
          >
            {savingImg ? "Saving . . ." : "Save to Gallery"}
          </button>
        </div>

      </form>
    </section>
  );
};

export default CreateImage;
