import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SchoolInfo } from "types/schoolInfo";
import { db } from "../../firebase";

const WebsiteContent = () => {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
  const [formData, setFormData] = useState<
    Partial<SchoolInfo & { [key: string]: any }>
  >({});
  const [editMode, setEditMode] = useState({
    schoolInfo: false,
    noticeNews: false,
    aboutUs: false,
  });

  useEffect(() => {
    const getSchoolInfo = async () => {
      db.collection("WEBSITE_CONFIG")
        .doc("websiteConfig")
        .get()
        .then((data) => {
          if (data.exists) {
            const schoolData = data.data();
            if (schoolData) {
              setSchoolInfo(schoolData as SchoolInfo);
              setFormData(schoolData as SchoolInfo);
            }
          } else {
            console.log("No such document found");
          }
        });
    };
    getSchoolInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    if (keys.length > 1) {
      setFormData((prev) => {
        let updatedData = { ...prev };
        let temp = updatedData;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!temp[keys[i]]) temp[keys[i]] = {};
          temp = temp[keys[i]];
        }
        temp[keys[keys.length - 1]] = value;
        return updatedData;
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleEditMode = (section: string, mode: boolean) => {
    setEditMode((prev) => ({ ...prev, [section]: mode }));
  };

  const handleSubmit = async (e: React.FormEvent, section: string) => {
    e.preventDefault();
    if (schoolInfo) {
      await db
        .collection("WEBSITE_CONFIG")
        .doc("websiteConfig")
        .update(formData);
      setSchoolInfo({ ...schoolInfo, ...formData });
      handleEditMode(section, false);
    }
  };

  return (
    <Paper
      sx={{
        padding: "16px",
        color: "#000",
      }}
    >
      <Typography variant="h4" sx={{ mb: 7 }}>
        Update School Info
      </Typography>

      <form onSubmit={(e) => handleSubmit(e, "schoolInfo")}>
        <Typography variant="h5" sx={{ mb: 5 }}>
          School Info
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="School Name"
              name="schoolName"
              value={formData.schoolName || ""}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              disabled={!editMode.schoolInfo}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="School Address"
              name="schoolAddress"
              value={formData.schoolAddress || ""}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              disabled={!editMode.schoolInfo}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              name="contactDetails.email"
              value={formData.contactDetails?.email || ""}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              disabled={!editMode.schoolInfo}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Phone Numbers"
              name="contactDetails.phoneNumbers"
              value={formData.contactDetails?.phoneNumbers.join(", ") || ""}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              disabled={!editMode.schoolInfo}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          {editMode.schoolInfo ? (
            <>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleEditMode("schoolInfo", false)}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" type="submit">
                  Save
                </Button>
              </Grid>
            </>
          ) : (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleEditMode("schoolInfo", true)}
              >
                Edit
              </Button>
            </Grid>
          )}
        </Grid>
      </form>

      <Divider sx={{ my: 2 }} />

      <form onSubmit={(e) => handleSubmit(e, "noticeNews")}>
        <Typography variant="h5" sx={{ mb: 5 }}>
          Notice & News
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Latest News"
              name="latestNews"
              value={formData.latestNews || ""}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              disabled={!editMode.noticeNews}
            />
          </Grid>

          {formData.noticeBoard?.map((notice, index) => (
            <Grid container spacing={2} key={index} sx={{ mt: 3 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                {"Notice " + index + 1}
              </Typography>
              <Grid item xs={12}>
                <TextField
                  label={`Notice ${index + 1}`}
                  name={`noticeBoard.${index}.noticeContent`}
                  value={notice.noticeContent}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  disabled={!editMode.noticeNews}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <TextField
                  label={`Date ${index + 1}`}
                  name={`noticeBoard.${index}.createdAt`}
                  value={notice.createdAt.toString()}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  disabled={!editMode.noticeNews}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
          {editMode.noticeNews ? (
            <>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleEditMode("noticeNews", false)}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" type="submit">
                  Save
                </Button>
              </Grid>
            </>
          ) : (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleEditMode("noticeNews", true)}
              >
                Edit
              </Button>
            </Grid>
          )}
        </Grid>
      </form>

      <Divider sx={{ my: 2 }} />

      <form onSubmit={(e) => handleSubmit(e, "aboutUs")}>
        <Typography variant="h5" sx={{ mb: 5 }}>
          About Us
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Inspirational Quote"
              name="aboutUs.inspirationalQuote.inspirationalQuoteMessage"
              value={
                formData.aboutUs?.inspirationalQuote
                  .inspirationalQuoteMessage || ""
              }
              onChange={handleChange}
              variant="outlined"
              fullWidth
              disabled={!editMode.aboutUs}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 1 }}>
            <TextField
              label="Quote Author"
              name="aboutUs.inspirationalQuote.inspirationalQuoteAuthor"
              value={
                formData.aboutUs?.inspirationalQuote.inspirationalQuoteAuthor ||
                ""
              }
              onChange={handleChange}
              variant="outlined"
              fullWidth
              disabled={!editMode.aboutUs}
            />
          </Grid>

          {formData.aboutUs?.messages.map((message, index) => (
            <Grid container spacing={2} key={index} sx={{ mt: 5 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                {"Message " + index + 1}
              </Typography>
              <Grid item xs={12}>
                <TextField
                  label={`Message Title ${index + 1}`}
                  name={`aboutUs.messages.${index}.messageTitle`}
                  value={message.messageTitle}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  disabled={!editMode.aboutUs}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <TextField
                  label={`Message Content ${index + 1}`}
                  name={`aboutUs.messages.${index}.messageContent`}
                  value={message.messageContent}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  disabled={!editMode.aboutUs}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <TextField
                  label={`Message By ${index + 1}`}
                  name={`aboutUs.messages.${index}.messageBy`}
                  value={message.messageBy}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  disabled={!editMode.aboutUs}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <TextField
                  label={`Highlighted Message ${index + 1}`}
                  name={`aboutUs.messages.${index}.highlightedMessage`}
                  value={message.highlightedMessage}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  disabled={!editMode.aboutUs}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          {editMode.aboutUs ? (
            <>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleEditMode("aboutUs", false)}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" type="submit">
                  Save
                </Button>
              </Grid>
            </>
          ) : (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleEditMode("aboutUs", true)}
              >
                Edit
              </Button>
            </Grid>
          )}
        </Grid>
      </form>
    </Paper>
  );
};

export default WebsiteContent;
