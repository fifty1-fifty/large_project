import React from "react";
import './Gallery_Ex.css'

interface Photo 
{
  src: string;
  title: string;
}

const PhotoGallery: React.FC = (props) => {
  // State to hold photo data
 /* const [photos, setPhotos] = useState<Photo[]>([]);

  // Simulate fetching dynamic data
  useEffect(() => {
    const photoData: Photo[] = [
      { src: "./", title: "Photo 1" },
      { src: "https://via.placeholder.com/300", title: "Photo 2" },
      { src: "https://via.placeholder.com/300", title: "Photo 3" },
      { src: "https://via.placeholder.com/300", title: "Photo 4" },
      { src: "https://via.placeholder.com/300", title: "Photo 5" },
      { src: "https://via.placeholder.com/300", title: "Photo 6" },
      { src: "https://via.placeholder.com/300", title: "Photo 7" },
      { src: "https://via.placeholder.com/300", title: "Photo 8" },
      { src: "https://via.placeholder.com/300", title: "Photo 9" },
      { src: "https://via.placeholder.com/300", title: "Photo 9" },
      { src: "https://via.placeholder.com/300", title: "Photo 9" },
      { src: "https://via.placeholder.com/300", title: "Photo 9" },
      { src: "https://via.placeholder.com/300", title: "Photo 9" },
      { src: "https://via.placeholder.com/300", title: "Photo 9" },
      { src: "https://via.placeholder.com/300", title: "pls fucking kill me" },
      { src: "https://via.placeholder.com/300", title: "pls fucking kill me" },
      { src: "https://via.placeholder.com/300", title: "pls fucking kill me" },
      { src: "https://via.placeholder.com/300", title: "pls fucking kill me" },
      { src: "https://via.placeholder.com/300", title: "pls fucking kill me" },
      { src: "https://via.placeholder.com/300", title: "pls fucking kill me" },
      { src: "https://via.placeholder.com/300", title: "pls fucking kill me" },
      { src: "https://via.placeholder.com/300", title: "pls fucking kill me" },
      { src: "https://via.placeholder.com/300", title: "pls fucking kill me" },
      { src: "https://via.placeholder.com/300", title: "pls fucking kill me" }
    ];
    setPhotos(photoData);
  }, []); */

  return (
    <h3> {props.data}</h3>
  );
};

export default PhotoGallery;
