import axios from "axios";
import React from "react";
import request from "./axios";
import NoImage from "./assets/no-image.png"
import { toast } from "react-toastify";

const baseurl = "http://localhost:3000/"

function App() {
  const [ img, setImage ] = React.useState(NoImage);
  const [ imgs, setImages ] = React.useState([]);
  const [ uploadedImg, setUploadedImage ] = React.useState(null);

  React.useEffect(() => {
    async function getImages() {
      try {
        const res = await request.get("api/upload");
        if (res.data.files.length >= 1)
          setImage(baseurl + res.data.files[0]);
        else
          setImage(NoImage);
        setImages(res.data.files);
      } catch (err) {
        if (err)
          toast.info("no images found !", {position: toast.POSITION.TOP_RIGHT})
      }
    }

    getImages();
  }, []);

  const onSubmit = () => {
    const formdata = new FormData();

    if (!uploadedImg)
      return;

    formdata.append("testFile", uploadedImg);

    request.post("api/upload", formdata)
      .then(res => {
        setImages(prev => [ ...prev, res.data.filename ])
        setImage(baseurl + res.data.filename)
        toast.success("Image saved successfully !", {position: toast.POSITION.TOP_RIGHT})
      })
      .catch(err => {
        toast.error(err.response?.data?.message, {position: toast.POSITION.TOP_RIGHT})
      })
  }

  const onFileChange = (e) => {
    if (e.target.files)
      setUploadedImage(e.target.files[0])
    else
      setUploadedImage(null);
  }

  const onFileChangeError = () => {
    toast.error("Error please retry again !", {position: toast.POSITION.TOP_RIGHT});
  }

  return (
    <div className="container">
      <div className="main-photo">
        <img src={img} alt="main" />
      </div>
      <div className="select-photos">
        {imgs.map(img => (
          <div className="select-photo-wrapper" onClick={() => setImage(baseurl + img)}>
            <img src={baseurl + img} alt="second" />
          </div>
        ))}
      </div>
      <div>
      <input type="file" className="input-file" onChange={onFileChange} onError={onFileChangeError} />
      <button onClick={onSubmit}>submit</button>
      </div>
    </div>
  );
}

export default App;
