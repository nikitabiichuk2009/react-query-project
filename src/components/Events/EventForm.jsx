import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ImagePicker from "../ImagePicker.jsx";
import { fetchSelectableImages } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { useRef } from "react";
export default function EventForm({ inputData, onSubmit, children }) {
  const [validImage, setValidImage] = useState(true);
  // const [selectedImage, setSelectedImage] = useState(inputData?.image);
  const today = new Date().toISOString().split("T")[0];
  // const { data, isPending, isError, error } = useQuery({
  //   queryKey: ["events-images"],
  //   queryFn: fetchSelectableImages,
  // });
  // function handleSelectImage(image) {
  //   setSelectedImage(image);
  // }

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    console.log(data);
    console.log(data.image);
    if (
      !data.image.includes("https://images.unsplash.com/photo-") &&
      !data.image.includes("https://i.postimg.cc/")
    ) {
      setValidImage(false);
      return;
    }

    console.log(data);
    setValidImage(true);
    onSubmit({ ...data, image: data.image });
  }

  return (
    <form id="event-form" onSubmit={handleSubmit}>
      <p className="control">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={inputData?.title ?? ""}
          required
          minLength={8}
          maxLength={35}
        />
      </p>
      {/* {isPending && <p>Loading...</p>}
      {isError && (
        <ErrorBlock
          title="An error occurred"
          message={error.info ? error.info.message : "Failed to fetch images"}
        />
      )}
      {data && (
        <div className="control">
          <ImagePicker
            images={data}
            onSelect={handleSelectImage}
            selectedImage={selectedImage}
          />
        </div>
      )} */}

      <p className="control">
        <label htmlFor="title">
          Image URL (<a href="https://unsplash.com">Unsplash</a> or{" "}
          <a href="https://postimages.org">PostImages</a>)
        </label>
        {!validImage && (
          <p className="error">
            Please enter a URL from <a href="https://unsplash.com">Unsplash </a>
            or host any image you want online on and provide its URL,{" "}
            <a href="https://postimages.org">PostImages</a>
          </p>
        )}
        <input
          type="url"
          id="image"
          name="image"
          defaultValue={inputData?.image ?? ""}
          required
        />
      </p>
      <p className="control">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={inputData?.description ?? ""}
          required
          minLength={20}
          maxLength={200}
        />
      </p>

      <div className="controls-row">
        <p className="control">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            defaultValue={inputData?.date ?? ""}
            min={today}
            required
          />
        </p>

        <p className="control">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            defaultValue={inputData?.time ?? ""}
            required
          />
        </p>
      </div>

      <p className="control">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          defaultValue={inputData?.location ?? ""}
          required
          minLength={8}
          maxLength={50}
        />
      </p>

      <p className="form-actions">{children}</p>
    </form>
  );
}
