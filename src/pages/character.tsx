import { AppBar, Box, CardMedia } from "@mui/material";
import React, { useEffect } from "react";
import useAvatarImage from "../apis/avatarImage";
import useStyle, { COLORS } from "./styles";
import { Canvas } from "@react-three/fiber";
import { Doggo } from "../components/ThreeJS/Doggo07";
import { ZEPETO_TORSO_3 } from "../components/ThreeJS/ZEPETO_TORSO_3";
import ResponsiveAppBar from "../components/Layout/Header";
import ResponsiveGrid from "../components/Layout/Footer";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Character: React.FC = () => {
  const { storedImage } = useAvatarImage();
  const { boxWidth } = useStyle();

  const Voices = [
    {
      languageCodes: ["en-US"],
      name: "en-US-Standard-A",
      ssmlGender: "FEMALE",
      naturalSampleRateHertz: 24000,
      code: "English-Female",
    },
    {
      languageCodes: ["en-US"],
      name: "en-US-Standard-B",
      ssmlGender: "MALE",
      naturalSampleRateHertz: 24000,
      code: "English-Male",
    },
    {
      languageCodes: ["hi-IN"],
      name: "hi-IN-Wavenet-A",
      ssmlGender: "FEMALE",
      naturalSampleRateHertz: 24000,
      code: "Hindi-Female",
    },
    {
      languageCodes: ["hi-IN"],
      name: "hi-IN-Wavenet-B",
      ssmlGender: "MALE",
      naturalSampleRateHertz: 24000,
      code: "Hindi-Male",
    },
    {
      languageCodes: ["te-IN"],
      name: "te-IN-Standard-A",
      ssmlGender: "FEMALE",
      naturalSampleRateHertz: 24000,
      code: "Telugu-Female",
    },
    {
      languageCodes: ["te-IN"],
      name: "te-IN-Standard-B",
      ssmlGender: "MALE",
      naturalSampleRateHertz: 24000,
      code: "Telugu-Male",
    },
    {
      languageCodes: ["bn-IN"],
      name: "bn-IN-Standard-A",
      ssmlGender: "FEMALE",
      naturalSampleRateHertz: 24000,
      code: "Bangla-Female",
    },
    {
      languageCodes: ["fil-PH"],
      name: "fil-PH-Standard-A",
      ssmlGender: "FEMALE",
      naturalSampleRateHertz: 24000,
      code: "Philippines-Female",
    },
  ];

  const setVoice = (voice: any) => {
    for (let i of Voices) {
      if (i.code === voice) {
        sessionStorage.setItem("voice", JSON.stringify(i));
      }
    }
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#1976d2",
      },
    },
  });

  const turnAudio = async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  };

  useEffect(() => {
    const user = localStorage.getItem("id");
    if (!user) {
      window.location.href = "/";
    } else {
      // turnAudio();
    }
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <ResponsiveAppBar />
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          paddingLeft: "5vh",
          paddingRight: "5vh",
          bgcolor: COLORS.bgcolor,
        }}
      >
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          sx={{ width: boxWidth, alignSelf: "center" }}
        >
          <Box sx={{ minWidth: 120, marginTop: 2, marginBottom: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Language</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
                onChange={(e) => setVoice(e.target.value)}
              >
                {Voices.map((voice, index) => (
                  <MenuItem value={voice.code} key={index}>
                    {voice.code}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </AppBar>

        <Box
          component="div"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <Box
            component="div"
            className="shadow-box"
            sx={{
              width: boxWidth,
              height: "40vh",
              boxSizing: "border-box",
              overflow: "hidden",
              margin: "0 0 2vh 0",
              bgcolor: "#FFFFFF",
            }}
          >
            <Canvas
              camera={{
                fov: 45,
                rotation: [0, 0, 0],
                position: [0, 0, 10],
              }}
              style={{ backgroundColor: "#FAD972" }}
            >
              <pointLight position={[0, 0, 10]} intensity={0.03} />
              <Doggo></Doggo>
            </Canvas>
          </Box>

          <Box
            component="div"
            sx={{
              width: boxWidth,
              textAlign: "left",
              boxSizing: "content-box",
              overflow: "hidden",
            }}
          ></Box>

          {/* <Box
            component="div"
            className="shadow-box"
            sx={{
              width: boxWidth,
              height: "15vh",
              verticalAlign: "middle",
              boxSizing: "content-box",
              margin: "2vh 0",
              bgcolor: "#FFFFFF",
            }}
          >
            <Typography
              style={{ color: COLORS.primary }}
              sx={{
                padding: "0.8vh",
                margin: "1.2vh",
                textAlign: "left",
                height: "11vh",
                overflow: "scroll",
                "&::-webkit-scrollbar": {
                  width: "1.5px",
                  height: "0",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#AAA",
                  borderRadius: "0.7px",
                },
                borderRadius: "4vh",
                fontFamily: "Google Sans, sans-serif",
                fontSize: "14px",
              }}
            >
              {transcript[1]}
            </Typography>
          </Box> */}

          {/* <Box
            component="div"
            sx={{
              justifyContent: "center",
              paddingTop: "2vh",
              transform: "translate(15px, -30px)",
            }}
          >
            {characterStateIcon[characterState]}
            <Box
              component="div"
              className={`bar-container ${
                characterState != CharacterState.Listening ? "hidden" : ""
              }`}
            >
              <Box
                component="div"
                ref={(el: HTMLDivElement | null) => (bars.current[0] = el)}
                className="bar"
              />
              <Box
                component="div"
                ref={(el: HTMLDivElement | null) => (bars.current[1] = el)}
                className="bar middle"
              />
              <Box
                component="div"
                ref={(el: HTMLDivElement | null) => (bars.current[2] = el)}
                className="bar"
              />
            </Box>
          </Box> */}
        </Box>
        <ResponsiveGrid />
      </Box>
    </ThemeProvider>
  );
};

export default Character;
