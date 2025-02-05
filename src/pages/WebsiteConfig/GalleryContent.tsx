import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { PhotoGalleryCategory, VideoGalleryCategory } from "types/gallery";

const GalleryContent = () => {
  const [photoGalleryData, setPhotoGalleryData] = useState<
    PhotoGalleryCategory[]
  >([]);
  const [videoGalleryData, setVideoGalleryData] = useState<
    VideoGalleryCategory[]
  >([]);

  useEffect(() => {
    const getPhotoGalleryData = async () => {
      db.collection("WEBSITE_CONFIG")
        .doc("photoGallary")
        .get()
        .then((data) => {
          if (data.exists) {
            const galleryData = data.data() as PhotoGalleryCategory;
            setPhotoGalleryData([galleryData]);
          } else {
            console.log("No such document found");
          }
        });
    };
    getPhotoGalleryData();
  }, []);

  useEffect(() => {
    const getVideoGalleryData = async () => {
      db.collection("WEBSITE_CONFIG")
        .doc("videoGallary")
        .get()
        .then((data) => {
          if (data.exists) {
            const galleryData = data.data() as VideoGalleryCategory;
            setVideoGalleryData([galleryData]);
          } else {
            console.log("No such document found");
          }
        });
    };
    getVideoGalleryData();
  }, []);

  return (
    <Paper
      sx={{
        padding: "16px",
        color: "#000",
      }}
    ></Paper>
  );
};

export default GalleryContent;
