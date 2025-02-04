import React, { useState } from "react";
import axios from "axios";

function Test() {
  const [imageData, setImageData] = useState([]);

  async function handleFetch() {
    try {
      const res = await axios.get("http://localhost:8888/api/getPictures");

      const uint8Array = new Uint8Array(res.data[0].data.data);

      // Step 2: Create a Blob from the Uint8Array
      const blob = new Blob([uint8Array], { type: "image/png" }); // Adjust type as per your image format

      // Step 3: Generate a data URL from the Blob
      const imageURL = URL.createObjectURL(blob);

      console.log(res.data, imageURL, "fetching data");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <button onClick={handleFetch}>Fetch data</button>
      <img
        src="blob:http://localhost:5173/891ddca8-ac1c-4d0d-bec5-7c8d69ea883a"
        alt="img"
      />
      {imageData.length > 0 &&
        imageData.map((item) => {
          return <div></div>;
        })}
    </div>
  );
}
export default Test;
