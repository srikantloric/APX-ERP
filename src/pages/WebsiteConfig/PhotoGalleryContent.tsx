import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Divider,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { PhotoGalleryCategory } from "types/gallery";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const PhotoGalleryContent = () => {
  // const [photoGalleryData, setPhotoGalleryData] = useState<
  //   PhotoGalleryCategory[]
  // >([]);
  const [formData, setFormData] = useState<Partial<PhotoGalleryCategory>[]>([]);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [imageEditMode, setImageEditMode] = useState<{
    [key: string]: boolean;
  }>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "photo";
    index: number;
  } | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newEventData, setNewEventData] = useState<
    Partial<PhotoGalleryCategory>
  >({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPhotoGalleryData = async () => {
      try {
        const data = await db
          .collection("WEBSITE_CONFIG")
          .doc("photoGallary")
          .get();
        if (data.exists) {
          const galleryData = data.data()?.events as PhotoGalleryCategory[];
          // setPhotoGalleryData(galleryData);
          setFormData(galleryData);
        } else {
          console.log("No such document found");
        }
      } catch (err) {
        console.error("Error fetching photo gallery data:", err);
        setError("Failed to fetch photo gallery data.");
      }
    };
    getPhotoGalleryData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    subIndex?: number
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = [...prev];
      if (subIndex !== undefined) {
        const updatedImages = [...(updatedData[index].images || [])];
        updatedImages[subIndex] = {
          ...updatedImages[subIndex],
          imageUrl: value,
        };
        updatedData[index] = { ...updatedData[index], images: updatedImages };
      } else {
        updatedData[index] = { ...updatedData[index], [name]: value };
      }
      return updatedData;
    });
  };

  const handleEditMode = (index: number, mode: boolean) => {
    setEditMode((prev) => ({ ...prev, [`photoGallery-${index}`]: mode }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db
        .collection("WEBSITE_CONFIG")
        .doc("photoGallary")
        .set({ events: formData });
      // setPhotoGalleryData(formData as PhotoGalleryCategory[]);
      setError(null);
    } catch (err) {
      console.error("Error updating photo gallery data:", err);
      setError("Failed to update photo gallery data.");
    }
  };

  const handleAddImage = (index: number) => {
    setFormData((prev) => {
      const updatedData = [...prev];
      if (!updatedData[index].images) {
        updatedData[index].images = [{ imageUrl: "" }];
      } else {
        updatedData[index].images?.push({ imageUrl: "" });
      }
      return updatedData;
    });
  };

  const handleDeleteImage = (galleryIndex: number, imageIndex: number) => {
    setFormData((prev) => {
      const updatedData = [...prev];
      if (updatedData[galleryIndex].images) {
        updatedData[galleryIndex].images = updatedData[
          galleryIndex
        ].images!.filter((_, i) => i !== imageIndex);
      }
      return updatedData;
    });
  };

  const handleEditImage = (
    galleryIndex: number,
    imageIndex: number,
    mode: boolean
  ) => {
    setImageEditMode((prev) => ({
      ...prev,
      [`${galleryIndex}-${imageIndex}`]: mode,
    }));
  };

  const handleAddPhotoEvent = () => {
    setAddDialogOpen(true);
  };

  const handleNewEventChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewEvent = async () => {
    try {
      const updatedData = [
        ...formData,
        {
          ...newEventData,
          eventId: newEventData.eventId || "",
          eventThumbnail: newEventData.eventThumbnail || "",
          images: [{ imageUrl: "" }],
        } as PhotoGalleryCategory,
      ];
      setFormData(updatedData);
      await saveFormData(updatedData); // Save changes to Firebase
      setAddDialogOpen(false);
      setNewEventData({});
      setError(null);
    } catch (err) {
      console.error("Error adding new event:", err);
      setError("Failed to add new event.");
    }
  };

  const cancelAddNewEvent = () => {
    setAddDialogOpen(false);
    setNewEventData({});
  };

  const handleDeletePhotoEvent = (index: number) => {
    setDeleteTarget({ type: "photo", index });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setFormData((prev) => {
        const updatedData = prev.filter((_, i) => i !== deleteTarget.index);
        return updatedData;
      });
    }
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const saveFormData = async (data: Partial<PhotoGalleryCategory>[]) => {
    try {
      await db
        .collection("WEBSITE_CONFIG")
        .doc("photoGallary")
        .set({ events: data });
    } catch (err) {
      console.error("Error saving photo gallery data:", err);
      setError("Failed to save photo gallery data.");
    }
  };

  return (
    <div>
      <Paper
        sx={{
          padding: "16px",
          color: "#000",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ mb: 7 }}>
          Photo Gallery
        </Typography>

        {error && (
          <Typography variant="body1" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddPhotoEvent}
          sx={{ mb: 2 }}
        >
          Add Photo Event
        </Button>

        {formData.map((photo, index) => (
          <form key={index} onSubmit={handleSubmit}>
            <div>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Typography variant="h6" sx={{ mt: 3, p: 5 }}>
                  {"Event " + (index + 1)}
                </Typography>
                <Grid item xs={12}>
                  <TextField
                    label="Event ID"
                    name="eventId"
                    value={photo.eventId || ""}
                    onChange={(e) => handleChange(e, index)}
                    variant="outlined"
                    fullWidth
                    disabled={!editMode[`photoGallery-${index}`]}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <TextField
                    label="Photo Title"
                    name="eventTitle"
                    value={photo.eventTitle || ""}
                    onChange={(e) => handleChange(e, index)}
                    variant="outlined"
                    fullWidth
                    disabled={!editMode[`photoGallery-${index}`]}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <TextField
                    label="Event Thumbnail URL"
                    name="eventThumbnail"
                    value={photo.eventThumbnail || ""}
                    onChange={(e) => handleChange(e, index)}
                    variant="outlined"
                    fullWidth
                    disabled={!editMode[`photoGallery-${index}`]}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <TextField
                    label="Description"
                    name="description"
                    value={photo.description || ""}
                    onChange={(e) => handleChange(e, index)}
                    variant="outlined"
                    fullWidth
                    disabled={!editMode[`photoGallery-${index}`]}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <TextField
                    label="Event Date"
                    name="eventDate"
                    type="date"
                    value={photo.eventDate?.toString().split("T")[0] || ""}
                    onChange={(e) => handleChange(e, index)}
                    variant="outlined"
                    fullWidth
                    disabled={!editMode[`photoGallery-${index}`]}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                {editMode[`photoGallery-${index}`] && (
                  <>
                    <Grid item xs={12} sx={{ mt: 1 }}>
                      <Typography variant="h6">Images:</Typography>
                      {photo.images?.map((image, imgIndex) => (
                        <Grid
                          container
                          spacing={2}
                          key={imgIndex}
                          sx={{ mt: 1 }}
                        >
                          <Grid item xs={8}>
                            <TextField
                              label={`Image URL ${imgIndex + 1}`}
                              name="imageUrl"
                              value={image.imageUrl}
                              onChange={(e) => handleChange(e, index, imgIndex)}
                              variant="outlined"
                              fullWidth
                              disabled={!imageEditMode[`${index}-${imgIndex}`]}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton
                              aria-label="edit"
                              onClick={() =>
                                handleEditImage(
                                  index,
                                  imgIndex,
                                  !imageEditMode[`${index}-${imgIndex}`]
                                )
                              }
                            >
                              {imageEditMode[`${index}-${imgIndex}`] ? (
                                <SaveIcon color="success" />
                              ) : (
                                <EditIcon color="primary" />
                              )}
                            </IconButton>
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleDeleteImage(index, imgIndex)}
                              disabled={!editMode[`photoGallery-${index}`]}
                            >
                              <DeleteIcon color="error" />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddImage(index)}
                        sx={{ mt: 2 }}
                      >
                        Add Image
                      </Button>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }}>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeletePhotoEvent(index)}
                        sx={{ mt: 2 }}
                      >
                        Delete Event
                      </Button>
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={
                      editMode[`photoGallery-${index}`] ? (
                        <SaveIcon />
                      ) : (
                        <EditIcon />
                      )
                    }
                    onClick={() =>
                      handleEditMode(index, !editMode[`photoGallery-${index}`])
                    }
                  >
                    {editMode[`photoGallery-${index}`]
                      ? "Save Event"
                      : "Edit Event"}
                  </Button>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
            </div>
          </form>
        ))}
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this event? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={addDialogOpen}
        onClose={cancelAddNewEvent}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add New Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="eventId"
            label="Event ID"
            type="text"
            fullWidth
            onChange={handleNewEventChange}
          />
          <TextField
            margin="dense"
            name="eventTitle"
            label="Event Title"
            type="text"
            fullWidth
            onChange={handleNewEventChange}
          />
          <TextField
            margin="dense"
            name="eventThumbnail"
            label="Event Thumbnail URL"
            type="text"
            fullWidth
            onChange={handleNewEventChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            onChange={handleNewEventChange}
          />
          <TextField
            margin="dense"
            name="eventDate"
            label="Event Date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleNewEventChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelAddNewEvent} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddNewEvent} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PhotoGalleryContent;
