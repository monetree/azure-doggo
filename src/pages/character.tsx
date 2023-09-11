/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  KeyboardVoiceOutlined,
  MicOffOutlined,
  Pause,
  SettingsOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  CardMedia,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAvatarImage from "../apis/avatarImage";
import useLanguageModel from "../apis/languageModel";
import useSpeechRecognition, {
  CharacterState,
} from "../apis/speechRecognition";
import useTextToSpeech from "../apis/textToSpeech";
import useStyle, { COLORS } from "./styles";
import { Canvas } from "@react-three/fiber";
import * as talkingHead from "../apis/talkingHead";
import { Doggo } from "../components/ThreeJS/Doggo07";
import { ZEPETO_TORSO_3 } from "../components/ThreeJS/ZEPETO_TORSO_3";
import ResponsiveAppBar from "../components/Layout/Header";
import ResponsiveGrid from "../components/Layout/Footer";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const useZepetoModel = false;

const Character: React.FC = () => {
  const navigate = useNavigate();
  const { sendMessage } = useLanguageModel();
  const {
    characterState,
    bars,
    setCharacterState,
    onMicButtonPressed,
    setOnSpeechFoundCallback,
  } = useSpeechRecognition();
  const { convert, setOnProcessCallback } = useTextToSpeech();
  const { storedImage } = useAvatarImage();
  const [transcript, setTranscript] = useState<String[]>(["You", ""]);
  const { boxWidth } = useStyle();
  talkingHead.runBlendshapesDemo(useZepetoModel);

  const characterStateIcon = {
    [CharacterState.Idle]: (
      <IconButton
        className="shadow-box"
        onClick={onMicButtonPressed}
        aria-label="Start Recording"
        sx={{
          width: "10vh",
          height: "10vh",
          marginTop: "30px",
          padding: "16px",
          borderRadius: "50%",
          color: COLORS.primary,
          backgroundColor: COLORS.bgcolor,
          "&:hover": {
            backgroundColor: COLORS.bgcolor,
            "@media (hover: none)": {
              backgroundColor: COLORS.bgcolor,
            },
          },
        }}
      >
        <KeyboardVoiceOutlined sx={{ fontSize: "40px" }} />
      </IconButton>
    ),
    [CharacterState.Listening]: (
      <IconButton
        className="shadow-box"
        onClick={onMicButtonPressed}
        color="error"
        aria-label="Stop Recording"
        sx={{
          width: "10vh",
          height: "10vh",
          marginTop: "30px",
          padding: "16px",
          borderRadius: "50%",
          backgroundColor: COLORS.bgcolor,
          "&:hover": {
            backgroundColor: COLORS.bgcolor,
            "@media (hover: none)": {
              backgroundColor: COLORS.bgcolor,
            },
          },
        }}
      >
        <Pause sx={{ fontSize: "40px" }} />
      </IconButton>
    ),
    [CharacterState.Speaking]: (
      <IconButton
        className="shadow-box"
        onClick={onMicButtonPressed}
        color="default"
        aria-label="Recording Disabled"
        sx={{
          width: "10vh",
          height: "10vh",
          marginTop: "30px",
          padding: "16px",
          borderRadius: "50%",
          backgroundColor: "grey.400",
          "&:hover": {
            backgroundColor: "grey.500",
            "@media (hover: none)": {
              backgroundColor: "grey.400",
            },
          },
        }}
      >
        <MicOffOutlined sx={{ fontSize: "40px" }} />
      </IconButton>
    ),
  };

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

  // Usage

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

          {/* <Toolbar className="tool-bar">
          <Box
            component="div"
            className="shadow-back-button"
            sx={{ justifyContent: "center", color: COLORS.bgcolor }}
          >
            <IconButton
              onClick={handleCustomizeButtonClick}
              aria-label="fullscreen"
            >
              <SettingsOutlined
                sx={{ fontSize: "3vh", color: COLORS.primary }}
              />
            </IconButton>
          </Box>
        </Toolbar> */}
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
            {storedImage === "" || storedImage === null ? (
              useZepetoModel ? (
                <Canvas
                  camera={{
                    fov: 45,
                    rotation: [0, 0, 0],
                    position: [0, 0, 15],
                  }}
                >
                  <pointLight position={[0, 0, 10]} intensity={0.03} />
                  <ambientLight intensity={1} />
                  <ZEPETO_TORSO_3></ZEPETO_TORSO_3>
                </Canvas>
              ) : (
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
              )
            ) : (
              <CardMedia
                id="talkingHeadIframe"
                component="img"
                image={storedImage}
                alt="Uploaded Image"
              />
            )}
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
