import {
  Button,
  Paper,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { VideoGalleryCategory } from "types/gallery";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Confirmation from "../../utilities/Confirmation";

const VideoGalleryContent = () => {
  const [formData, setFormData] = useState<Partial<VideoGalleryCategory>[]>([]);
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editEventData, setEditEventData] = useState<
    Partial<VideoGalleryCategory>
  >({});

  useEffect(() => {
    const getVideoGalleryData = async () => {
      try {
        const data = await db
          .collection("WEBSITE_CONFIG")
          .doc("videoGallary")
          .get();
        if (data.exists) {
          const galleryData = data.data()?.events as VideoGalleryCategory[];
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
          videos: newEventData.videos || [{ videoUrl: "" }],
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

  const handleEditDialogOpen = (index: number) => {
    setEditEventData(formData[index]);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditEventData({});
  };

  const handleEditEventChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    videoIndex?: number
  ) => {
    const { name, value } = e.target;
    setEditEventData((prev) => {
      if (videoIndex !== undefined) {
        const updatedVideos = [...(prev.videos || [])];
        updatedVideos[videoIndex] = {
          ...updatedVideos[videoIndex],
          videoUrl: value,
        };
        return { ...prev, videos: updatedVideos };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSaveEditEvent = async () => {
    try {
      const updatedData = formData.map((event) =>
        event.eventId === editEventData.eventId ? editEventData : event
      );
      setFormData(updatedData);
      await saveFormData(updatedData); // Save changes to Firebase
      setEditDialogOpen(false);
      setEditEventData({});
      setError(null);
    } catch (err) {
      console.error("Error saving edited event:", err);
      setError("Failed to save edited event.");
    }
  };

  const handleDeleteVideoFromEdit = (videoIndex: number) => {
    setEditEventData((prev) => {
      const updatedVideos = (prev.videos || []).filter(
        (_, index) => index !== videoIndex
      );
      return { ...prev, videos: updatedVideos };
    });
  };

  const handleAddVideoToEdit = () => {
    setEditEventData((prev) => ({
      ...prev,
      videos: [...(prev.videos || []), { videoUrl: "" }],
    }));
  };

  const handleAddVideoToNewEvent = () => {
    setNewEventData((prev) => ({
      ...prev,
      videos: [...(prev.videos || []), { videoUrl: "" }],
    }));
  };

  const handleNewEventVideoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    videoIndex: number
  ) => {
    const { value } = e.target;
    setNewEventData((prev) => {
      const updatedVideos = [...(prev.videos || [])];
      updatedVideos[videoIndex] = { videoUrl: value };
      return { ...prev, videos: updatedVideos };
    });
  };

  return (
    <div>
      <Typography variant="h4">Video Gallery</Typography>
      <Typography variant="caption">Update Video Gallery Details</Typography>

      <Paper
        sx={{
          padding: "16px",
          color: "#000",
          my: 5,
        }}
      >
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

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Event ID</TableCell>
                <TableCell>Event Title</TableCell>
                <TableCell>Event Thumbnail</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Event Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.map((video, index) => (
                <TableRow key={index}>
                  <TableCell>{video.eventId}</TableCell>
                  <TableCell>{video.eventTitle}</TableCell>
                  <TableCell>{video.eventThumbnail}</TableCell>
                  <TableCell>{video.description}</TableCell>
                  <TableCell>
                    {video.eventDate?.toString().split("T")[0]}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEditDialogOpen(index)}
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteVideoEvent(index)}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="eventId"
            label="Event ID"
            type="text"
            fullWidth
            value={editEventData.eventId || ""}
            onChange={handleEditEventChange}
          />
          <TextField
            margin="dense"
            name="eventTitle"
            label="Event Title"
            type="text"
            fullWidth
            value={editEventData.eventTitle || ""}
            onChange={handleEditEventChange}
          />
          <TextField
            margin="dense"
            name="eventThumbnail"
            label="Event Thumbnail URL"
            type="text"
            fullWidth
            value={editEventData.eventThumbnail || ""}
            onChange={handleEditEventChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={editEventData.description || ""}
            onChange={handleEditEventChange}
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
            value={editEventData.eventDate?.toString().split("T")[0] || ""}
            onChange={handleEditEventChange}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Videos:
          </Typography>
          {editEventData.videos?.map((video, videoIndex) => (
            <div
              key={videoIndex}
              style={{ display: "flex", alignItems: "center" }}
            >
              <TextField
                margin="dense"
                name="videoUrl"
                label={`Video URL ${videoIndex + 1}`}
                type="text"
                fullWidth
                value={video.videoUrl}
                onChange={(e) => handleEditEventChange(e, videoIndex)}
              />
              <IconButton
                aria-label="delete"
                onClick={() => handleDeleteVideoFromEdit(videoIndex)}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </div>
          ))}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddVideoToEdit}
            sx={{ mt: 2 }}
          >
            Add Video
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveEditEvent} color="primary">
            Save
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
          <Typography variant="h6" sx={{ mt: 2 }}>
            Videos:
          </Typography>
          {newEventData.videos?.map((video, videoIndex) => (
            <TextField
              key={videoIndex}
              margin="dense"
              name="videoUrl"
              label={`Video URL ${videoIndex + 1}`}
              type="text"
              fullWidth
              value={video.videoUrl}
              onChange={(e) => handleNewEventVideoChange(e, videoIndex)}
            />
          ))}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddVideoToNewEvent}
            sx={{ mt: 2 }}
          >
            Add Video
          </Button>
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

      <Confirmation
        open={deleteDialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        description="Are you sure you want to delete this event? This action cannot be undone."
      />
    </div>
  );
};

export default VideoGalleryContent;
