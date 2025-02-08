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
import { PhotoGalleryCategory } from "types/gallery";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Confirmation from "../../utilities/Confirmation";

const PhotoGalleryContent = () => {
  const [formData, setFormData] = useState<Partial<PhotoGalleryCategory>[]>([]);
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editEventData, setEditEventData] = useState<
    Partial<PhotoGalleryCategory>
  >({});

  useEffect(() => {
    const getPhotoGalleryData = async () => {
      try {
        const data = await db
          .collection("WEBSITE_CONFIG")
          .doc("photoGallary")
          .get();
        if (data.exists) {
          const galleryData = data.data()?.events as PhotoGalleryCategory[];
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
          images: newEventData.images || [{ imageUrl: "" }],
        } as PhotoGalleryCategory,
      ];
      setFormData(updatedData);
      await saveFormData(updatedData); // Save changes to Firebase
      setAddDialogOpen(false);
      setNewEventData({});
      setError(null);
    } catch (err) {
      console.error("Error adding new photo event:", err);
      setError("Failed to add new photo event.");
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
        console.error("Error deleting photo event:", err);
        setError("Failed to delete photo event.");
      }
    }
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
    imageIndex?: number
  ) => {
    const { name, value } = e.target;
    setEditEventData((prev) => {
      if (imageIndex !== undefined) {
        const updatedImages = [...(prev.images || [])];
        updatedImages[imageIndex] = {
          ...updatedImages[imageIndex],
          imageUrl: value,
        };
        return { ...prev, images: updatedImages };
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

  const handleDeleteImageFromEdit = (imageIndex: number) => {
    setEditEventData((prev) => {
      const updatedImages = (prev.images || []).filter(
        (_, index) => index !== imageIndex
      );
      return { ...prev, images: updatedImages };
    });
  };

  const handleAddImageToEdit = () => {
    setEditEventData((prev) => ({
      ...prev,
      images: [...(prev.images || []), { imageUrl: "" }],
    }));
  };

  const handleAddImageToNewEvent = () => {
    setNewEventData((prev) => ({
      ...prev,
      images: [...(prev.images || []), { imageUrl: "" }],
    }));
  };

  const handleNewEventImageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    imageIndex: number
  ) => {
    const { value } = e.target;
    setNewEventData((prev) => {
      const updatedImages = [...(prev.images || [])];
      updatedImages[imageIndex] = { imageUrl: value };
      return { ...prev, images: updatedImages };
    });
  };

  return (
    <div>
      <Typography variant="h4">Photo Gallery</Typography>
      <Typography variant="caption">Update Photo Gallery Details</Typography>

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
          onClick={handleAddPhotoEvent}
          sx={{ mb: 2 }}
        >
          Add Photo Event
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
              {formData.map((photo, index) => (
                <TableRow key={index}>
                  <TableCell>{photo.eventId}</TableCell>
                  <TableCell>{photo.eventTitle}</TableCell>
                  <TableCell>{photo.eventThumbnail}</TableCell>
                  <TableCell>{photo.description}</TableCell>
                  <TableCell>
                    {photo.eventDate?.toString().split("T")[0]}
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
                      onClick={() => handleDeletePhotoEvent(index)}
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
            Images:
          </Typography>
          {editEventData.images?.map((image, imageIndex) => (
            <div
              key={imageIndex}
              style={{ display: "flex", alignItems: "center" }}
            >
              <TextField
                margin="dense"
                name="imageUrl"
                label={`Image URL ${imageIndex + 1}`}
                type="text"
                fullWidth
                value={image.imageUrl}
                onChange={(e) => handleEditEventChange(e, imageIndex)}
              />
              <IconButton
                aria-label="delete"
                onClick={() => handleDeleteImageFromEdit(imageIndex)}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </div>
          ))}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddImageToEdit}
            sx={{ mt: 2 }}
          >
            Add Image
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
            Images:
          </Typography>
          {newEventData.images?.map((image, imageIndex) => (
            <TextField
              key={imageIndex}
              margin="dense"
              name="imageUrl"
              label={`Image URL ${imageIndex + 1}`}
              type="text"
              fullWidth
              value={image.imageUrl}
              onChange={(e) => handleNewEventImageChange(e, imageIndex)}
            />
          ))}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddImageToNewEvent}
            sx={{ mt: 2 }}
          >
            Add Image
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

export default PhotoGalleryContent;
