import { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";

import "./Login.scss";
import {
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IllustrationImg from "../../assets/illustration.png";


import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

import SchoolLogo from "../../assets/school-logo.jpg";
import SchoolConfigs from "config/SchoolConfigs";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const [visibility, setVisibility] = useState(false);
  const historyref = useNavigate();

  const { login, currentUser } = useAuth();

  const handleOnSubmit = async (e:any) => {
    setError(null);
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("All fields are requied!");
    } else {
      setLoading(true);
      console.log(username);
      db.collection("ADMIN_USERS")
        .where("user_email", "==", username)
        .get()
        .then((docSnap) => {
          if (docSnap.docs.length > 0) {
            login(username, password)
              .then((res:any) => {
                historyref("/");
                setLoading(false);
              })
              .catch((e:any) => {
                console.log(e);
                if (e.code === "auth/internal-error")
                  setError("Incorrect password !");
                if (e.code === "auth/too-many-requests")
                  setError(
                    "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later."
                  );
                setLoading(false);
              });
          } else {
            setError("User does not exist !");
            setLoading(false);
          }
        })
        .catch((e) => {
          console.log(e);
          setError(e.message);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (currentUser) {
      historyref("/");
    }
  }, []);

  return (
    <div className="login-container">
      <div className="left-section">
        <img src={IllustrationImg} alt="graphics"></img>
        <div>
          <h2>Welcome To E-School Dashboard</h2>
          <p>
            Manage and control students records, fees, complete app information
            and more.
          </p>
        </div>
      </div>
      <div className="right-section">
        <div style={{ display: "flex", flex: 1 }}>
          <div className="login-card">
            <img src={SchoolLogo} alt="school-logo" className="logo" />
            <h2>{SchoolConfigs.schoolName}</h2>
            <p>
              Welcome to School Management Dashboard Elevating Education
              Effortlessly!
            </p>
            <form className="form-control" onSubmit={handleOnSubmit}>
              <FormControl
                className="input-field"
                sx={{ width: "100%", mb: 2 }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-username">
                  Username
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-username"
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <AccountCircleIcon />
                    </InputAdornment>
                  }
                  label="Username"
                />
              </FormControl>

              <FormControl sx={{ width: "100%", mb: 2 }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={visibility ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        edge="end"
                        onClick={() => setVisibility(!visibility)}
                      >
                        {visibility ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <div className="auth-recovery">
                <FormGroup sx={{ ml: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox classes={{ root: "custom-checkbox-root" }} />
                    }
                    label="Remember me"
                  />
                </FormGroup>
               
              </div>
              {error ? (
                <Box>
                  <p style={{ color: "red" }}>{error}</p>
                </Box>
              ) : (
                ""
              )}
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress size={30} />
                </Box>
              ) : null}
              <button disabled={loading}>Login</button>
            </form>
          </div>
        </div>
        <span className="footer-content">
          Loric <span style={{ color: "blue" }}>Softwares</span> | Copyright
          2017-2025. All Rights Reserved.
        </span>
      </div>
    </div>
  );
}

export default Login;
