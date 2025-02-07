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
import { VideoGalleryCategory } from "types/gallery";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const VideoGalleryContent = () => {
  // const [videoGalleryData, setVideoGalleryData] = useState<
  //   VideoGalleryCategory[]
  // >([]);
  const [formData, setFormData] = useState<Partial<VideoGalleryCategory>[]>([]);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [videoEditMode, setVideoEditMode] = useState<{
    [key: string]: boolean;
  }>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "video";
    index: number;
  } | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newEventData, setNewEventData] = useState<
    Partial<VideoGalleryCategory>
  >({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getVideoGalleryData = async () => {
      try {
        const data = await db
          .collection("WEBSITE_CONFIG")
          .doc("videoGallary")
          .get();
        if (data.exists) {
          const galleryData = data.data()?.events as VideoGalleryCategory[];
          // setVideoGalleryData(galleryData);
          setFormData(galleryData);
        } else {
          console.log("No such document found");
        }
      } catch (err) {
        console.error("Error fetching video gallery data:", err);
        setError("Failed to fetch video gallery data.");
      }
    };
    getVideoGalleryData();
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
        const updatedVideos = [...(updatedData[index].videos || [])];
        updatedVideos[subIndex] = {
          ...updatedVideos[subIndex],
          videoUrl: value,
        };
        updatedData[index] = { ...updatedData[index], videos: updatedVideos };
      } else {
        updatedData[index] = { ...updatedData[index], [name]: value };
      }
      saveFormData(updatedData); // Save changes to Firebase
      return updatedData;
    });
  };

  const handleEditMode = (index: number, mode: boolean) => {
    setEditMode((prev) => ({ ...prev, [`videoGallery-${index}`]: mode }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db
        .collection("WEBSITE_CONFIG")
        .doc("videoGallary")
        .set({ events: formData });
      // setVideoGalleryData(formData as VideoGalleryCategory[]);
      setError(null);
    } catch (err) {
      console.error("Error updating video gallery data:", err);
      setError("Failed to update video gallery data.");
    }
  };

  const handleAddVideo = (index: number) => {
    setFormData((prev) => {
      const updatedData = [...prev];
      if (!updatedData[index].videos) {
        updatedData[index].videos = [{ videoUrl: "" }];
      } else {
        updatedData[index].videos?.push({ videoUrl: "" });
      }
      saveFormData(updatedData); // Save changes to Firebase
      return updatedData;
    });
  };

  const handleDeleteVideo = (galleryIndex: number, videoIndex: number) => {
    setFormData((prev) => {
      const updatedData = [...prev];
      if (updatedData[galleryIndex].videos) {
        updatedData[galleryIndex].videos = updatedData[
          galleryIndex
        ].videos!.filter((_, i) => i !== videoIndex);
      }
      saveFormData(updatedData); // Save changes to Firebase
      return updatedData;
    });
  };

  const handleEditVideo = (
    galleryIndex: number,
    videoIndex: number,
    mode: boolean
  ) => {
    setVideoEditMode((prev) => ({
      ...prev,
      [`${galleryIndex}-${videoIndex}`]: mode,
    }));
  };

  const handleAddVideoEvent = () => {
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
          videos: [{ videoUrl: "" }],
        } as VideoGalleryCategory,
      ];
      setFormData(updatedData);
      await saveFormData(updatedData); // Save changes to Firebase
      setAddDialogOpen(false);
      setNewEventData({});
      setError(null);
    } catch (err) {
      console.error("Error adding new video event:", err);
      setError("Failed to add new video event.");
    }
  };

  const cancelAddNewEvent = () => {
    setAddDialogOpen(false);
    setNewEventData({});
  };

  const handleDeleteVideoEvent = (index: number) => {
    setDeleteTarget({ type: "video", index });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        const updatedData = formData.filter((_, i) => i !== deleteTarget.index);
        setFormData(updatedData);
        await saveFormData(updatedData); // Save changes to Firebase
        setDeleteDialogOpen(false);
        setDeleteTarget(null);
        setError(null);
      } catch (err) {
        console.error("Error deleting video event:", err);
        setError("Failed to delete video event.");
      }
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const saveFormData = async (data: Partial<VideoGalleryCategory>[]) => {
    try {
      await db
        .collection("WEBSITE_CONFIG")
        .doc("videoGallary")
        .set({ events: data });
    } catch (err) {
      console.error("Error saving video gallery data:", err);
      setError("Failed to save video gallery data.");
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
          Video Gallery
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
          onClick={handleAddVideoEvent}
          sx={{ mb: 2 }}
        >
          Add Video Event
        </Button>

        {formData.map((video, index) => (
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
                    value={video.eventId || ""}
                    onChange={(e) => handleChange(e, index)}
                    variant="outlined"
                    fullWidth
                    disabled={!editMode[`videoGallery-${index}`]}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <TextField
                    label="Video Title"
                    name="eventTitle"
                    value={video.eventTitle || ""}
                    onChange={(e) => handleChange(e, index)}
                    variant="outlined"
                    fullWidth
                    disabled={!editMode[`videoGallery-${index}`]}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <TextField
                    label="Event Thumbnail URL"
                    name="eventThumbnail"
                    value={video.eventThumbnail || ""}
                    onChange={(e) => handleChange(e, index)}
                    variant="outlined"
                    fullWidth
                    disabled={!editMode[`videoGallery-${index}`]}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <TextField
                    label="Description"
                    name="description"
                    value={video.description || ""}
                    onChange={(e) => handleChange(e, index)}
                    variant="outlined"
                    fullWidth
                    disabled={!editMode[`videoGallery-${index}`]}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <TextField
                    label="Event Date"
                    name="eventDate"
                    type="date"
                    value={video.eventDate?.toString().split("T")[0] || ""}
                    onChange={(e) => handleChange(e, index)}
                    variant="outlined"
                    fullWidth
                    disabled={!editMode[`videoGallery-${index}`]}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                {editMode[`videoGallery-${index}`] && (
                  <>
                    <Grid item xs={12} sx={{ mt: 1 }}>
                      <Typography variant="h6">Videos:</Typography>
                      {video.videos?.map((vid, vidIndex) => (
                        <Grid
                          container
                          spacing={2}
                          key={vidIndex}
                          sx={{ mt: 1 }}
                        >
                          <Grid item xs={8}>
                            <TextField
                              label={`Video URL ${vidIndex + 1}`}
                              name="videoUrl"
                              value={vid.videoUrl}
                              onChange={(e) => handleChange(e, index, vidIndex)}
                              variant="outlined"
                              fullWidth
                              disabled={!videoEditMode[`${index}-${vidIndex}`]}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton
                              aria-label="edit"
                              onClick={() =>
                                handleEditVideo(
                                  index,
                                  vidIndex,
                                  !videoEditMode[`${index}-${vidIndex}`]
                                )
                              }
                            >
                              {videoEditMode[`${index}-${vidIndex}`] ? (
                                <SaveIcon color="success" />
                              ) : (
                                <EditIcon color="primary" />
                              )}
                            </IconButton>
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleDeleteVideo(index, vidIndex)}
                              disabled={!editMode[`videoGallery-${index}`]}
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
                        onClick={() => handleAddVideo(index)}
                        sx={{ mt: 2 }}
                      >
                        Add Video
                      </Button>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }}>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteVideoEvent(index)}
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
                      editMode[`videoGallery-${index}`] ? (
                        <SaveIcon />
                      ) : (
                        <EditIcon />
                      )
                    }
                    onClick={() =>
                      handleEditMode(index, !editMode[`videoGallery-${index}`])
                    }
                  >
                    {editMode[`videoGallery-${index}`]
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

export default VideoGalleryContent;
