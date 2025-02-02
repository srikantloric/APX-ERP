import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  Modal,
  Typography,
} from "@mui/joy";
import { styled } from "@mui/material/styles";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useState } from "react";
import FileResizer from "react-image-file-resizer";
import { db, storageRef } from "../../firebase";
import { enqueueSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";

const resizeFile = (file: any) =>
  new Promise((resolve) => {
    FileResizer.imageFileResizer(file, 500, 500, "WEBP", 100, 0, (uri) => {
      resolve(uri);
    });
  });
type studentProfileUpdateCardProps = {
  imageUrl: string;
  name: string;
  doc_id: string;
  student_id: string;
  father_name: string;
  student_email: string;
};

function UpdateStudentImageCard(props: studentProfileUpdateCardProps) {
  const [profil, Setprofil] = useState<any>();
  const [open, setOpen] = useState(false);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(
    null
  );
  const [uploadProgress, setUploadProgress] = useState<number | undefined>();

  // const stylee = {
  //   position: "absolute" as "absolute",
  //   top: "50%",
  //   left: "50%",
  //   transform: "translate(-50%, -50%)",
  //   width: "90%",
  //   bgcolor: "white",
  //   p: 4,
  //   display: "flex",
  //   flexDirection: "column",
  // };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setOpen(true);
      Setprofil(e.target.files[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const uploadImage = async () => {
    console.log(props.doc_id);
    if (profil) {
      setIsUpdatingImage(true);

      const fileRef = storageRef.child(
        `profileImages/${props.doc_id}/${props.student_email}`
      );

      const resizedImage: any = await resizeFile(profil);

      const uploadTask = fileRef.putString(resizedImage, "data_url");

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get upload progress
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          console.log("Error uploading image:", error);
        },
        () => {
          // Upload complete
          uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
            await db.collection("STUDENTS").doc(props.doc_id).update({
              profil_url: downloadURL,
            });
            setOpen(false);
            enqueueSnackbar("Profile Picture Updated!", { variant: "success" });
            setIsUpdatingImage(false);
          });
        }
      );

      // if (uploadTask.state === "success") {
      //   const url = await fileRef.getDownloadURL();
      //   console.log(url);
      //   console.log();

      //   await db.collection("STUDENTS").doc(props.doc_id).update({
      //     profil_url: url,
      //   });
      //   setOpen(false);
      //   enqueueSnackbar("Profile Picture Updated !",{variant:"success"})
      // } else {
      //   console.log("some went wrong while uploading image..");
      // }
    }
  };
  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      sx={{
        width: "100%",

        "&:hover": {
          boxShadow: "md",
          borderColor: "neutral.outlinedHoverBorder",
        },
      }}
    >
      <AspectRatio ratio="1" sx={{ width: 80 }}>
        <img
          src={props.imageUrl}
          srcSet={props.imageUrl}
          loading="lazy"
          alt=""
        />
      </AspectRatio>
      <CardContent
        orientation="horizontal"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography level="title-lg" id="card-description">
            {props.name}
          </Typography>
          <Typography level="body-sm" aria-describedby="card-description">
            {props.student_id}
          </Typography>
          <Typography
            level="body-sm"
            aria-describedby="card-description"
            mb={1}
          >
            {props.father_name}
          </Typography>
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card
            sx={{
              width: "100%",
              maxWidth: "90%",
              boxShadow: "lg",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Avatar
                src={previewImage?.toString()}
                sx={{ "--Avatar-size": "8rem" }}
              />
              {uploadProgress && isUpdatingImage ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  {`Uploading .. ${uploadProgress}%`}
                  <CircularProgress
                    sx={{ mb: 1, mt: 1 }}
                    variant="determinate"
                    value={uploadProgress}
                    size={"sm"}
                  />
                </div>
              ) : null}
            </CardContent>
            <CardOverflow sx={{ bgcolor: "background.level1" }}>
              <CardActions buttonFlex="1">
                <ButtonGroup
                  variant="outlined"
                  sx={{ bgcolor: "background.surface" }}
                >
                  <Button onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={uploadImage} disabled={isUpdatingImage}>
                    Update Image
                  </Button>
                </ButtonGroup>
              </CardActions>
            </CardOverflow>
          </Card>
        </Modal>

        <Box sx={{ height: "100%" }}>
          <Button
            variant="soft"
            startDecorator={<PhotoCameraIcon />}
            sx={{ height: "100%" }}
            component="label"
            role={undefined}
            tabIndex={-1}
          >
            <VisuallyHiddenInput
              type="file"
              accept="image/png ,image/jpeg"
              onChange={handleImageChange}
            />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default UpdateStudentImageCard;
