import useSpeechRecognition, {
  CharacterState,
} from "../../apis/speechRecognition";
import useLanguageModel from "../../apis/languageModel";
import { useEffect, useState } from "react";
import useTextToSpeech from "../../apis/textToSpeech";
import * as talkingHead from "../../apis/talkingHead";
import TextField from "@mui/material/TextField";
import TranscriptModalDialog from "./transcriptModal";
import { Button } from "@mui/material";

interface ChildComponentProps {
  transcript: string;
}

const ResponsiveGrid = () => {
  const {
    characterState,
    bars,
    setCharacterState,
    onMicButtonPressed,
    startRecording,
    stopRecording,
    setOnSpeechFoundCallback,
  } = useSpeechRecognition();

  const { convert, setOnProcessCallback, volumeDown, volumeUp } =
    useTextToSpeech();

  const useZepetoModel = false;
  const { sendMessage } = useLanguageModel();
  talkingHead.runBlendshapesDemo(useZepetoModel);
  const [transcript, setTranscript] = useState<String[]>(["You", ""]);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [volumeDownState, setVolumeDownState] = useState(false);

  const handleChange = (event: any) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    setOnProcessCallback((audioData: Float32Array) => {
      talkingHead.registerCallback(audioData);
    });
    setOnSpeechFoundCallback((transcription: string) => {
      setTranscript(["You", transcription]);
      sendMessage(transcription).then((result) => {
        setTranscript(["Buddy", result]);
        convert(result).then(() => {
          // setCharacterState(CharacterState.Idle);
        });
      });
    });
  }, []);

  const handleInput = (e: any) => {
    const bigForm = document.getElementById(
      "standard-basic"
    ) as HTMLInputElement;
    const smallForm = document.getElementById(
      "outlined-basic"
    ) as HTMLInputElement;

    if (bigForm) {
      bigForm.disabled = true;
    }

    if (smallForm) {
      smallForm.disabled = true;
    }
    try {
      e.preventDefault();
    } catch (error) {}

    setTranscript(["You", inputValue]);
    sendMessage(inputValue).then((result) => {
      setTranscript(["Buddy", result]);
      convert(result).then(() => {
        setInputValue("");
        setCharacterState(CharacterState.Idle);

        if (bigForm) {
          bigForm.disabled = false;
        }

        if (smallForm) {
          smallForm.disabled = false;
        }
      });
    });
  };

  const characterStateIcon = {
    [CharacterState.Idle]: (
      <button
        id="mute-icon"
        color="primary"
        className="un-mute mat-focus-indicator microphone mat-fab mat-button-base mat-primary"
        style={{
          borderRadius: "50%",
          height: "56px",
          width: "56px",
          border: "1px solid #fff",
          marginRight: "20px",
          marginLeft: "20px",
          cursor: "pointer",
        }}
        onClick={onMicButtonPressed}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879L5.158 2.037A3.001 3.001 0 0 1 11 3z"></path>
          <path d="M9.486 10.607 5 6.12V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z"></path>
        </svg>
      </button>
    ),
    [CharacterState.Listening]: (
      <button
        id="mute-icon"
        color="primary"
        className="un-mute mat-focus-indicator microphone mat-fab mat-button-base mat-primary"
        style={{
          borderRadius: "50%",
          height: "56px",
          width: "56px",
          border: "1px solid #fff",
          marginRight: "10px",
          marginLeft: "20px",
          cursor: "pointer",
        }}
        onClick={onMicButtonPressed}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="24"
          height="24"
          fill="#3C3C3C"
        >
          <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"></path>
          <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"></path>
        </svg>
        <span className="mat-button-wrapper"></span>
        <span className="mat-ripple mat-button-ripple mat-button-ripple-round"></span>
        <span className="mat-button-focus-overlay"></span>
      </button>
    ),
    [CharacterState.Speaking]: (
      <button
        id="mute-icon"
        color="primary"
        className="un-mute mat-focus-indicator microphone mat-fab mat-button-base mat-primary"
        style={{
          borderRadius: "50%",
          height: "56px",
          width: "56px",
          border: "1px solid #eee",
          marginRight: "10px",
          marginLeft: "20px",
          cursor: "pointer",
        }}
        disabled
      >
        <span className="mat-button-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"></path>
          </svg>
        </span>
        <span className="mat-ripple mat-button-ripple mat-button-ripple-round"></span>
        <span className="mat-button-focus-overlay"></span>
      </button>
    ),
  };

  const characterStateBits = {
    [CharacterState.Idle]: (
      <div
        id="speech-indicator"
        className={`speech-indicator mute`}
        style={{ marginRight: "20px" }}
      >
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
      </div>
    ),
    [CharacterState.Listening]: (
      <div
        id="speech-indicator"
        className={`speech-indicator`}
        style={{ marginRight: "20px" }}
      >
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
      </div>
    ),
    [CharacterState.Speaking]: (
      <div
        id="speech-indicator"
        className={`speech-indicator mute`}
        style={{ marginRight: "20px" }}
      >
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
      </div>
    ),
  };

  return (
    <div>
      <div className="form-container-sm">
        <TextField
          id="outlined-basic"
          label="Type your question here .. "
          variant="outlined"
          value={inputValue}
          onChange={handleChange}
        />
        <Button
          variant="outlined"
          style={{ border: "2px solid #fff", float: "right" }}
          onClick={handleInput}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
            fill="#fff"
          >
            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
          </svg>
        </Button>
      </div>

      <div
        className={"action-wrapper action-btns"}
        style={{
          alignItems: "center",
          bottom: "20px",
          display: "flex",
          left: "15px",
          position: "absolute",
        }}
      >
        {characterStateIcon[characterState]}
        {characterStateBits[characterState]}

        {/* <button
          id="mute-icon"
          color="primary"
          className="un-mute mat-focus-indicator microphone mat-fab mat-button-base mat-primary"
          style={{
            borderRadius: "50%",
            height: "56px",
            width: "56px",
            border: "1px solid #fff",
            marginRight: "20px",
            cursor: "pointer",
          }}
          onClick={() => {
            if (!volumeDownState) {
              volumeDown();
            } else {
              volumeUp();
            }
            setVolumeDownState(!volumeDownState);
          }}
        >
          <span className="mat-button-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="24"
              height="24"
              fill="#3C3C3C"
            >
              <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"></path>
              <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"></path>
              <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"></path>
            </svg>
          </span>
          <span className="mat-ripple mat-button-ripple mat-button-ripple-round"></span>
          <span className="mat-button-focus-overlay"></span>
        </button> */}

        <div className="form-container">
          <TextField
            id="outlined-basic"
            label="Type your question here .. "
            variant="outlined"
            value={inputValue}
            onChange={handleChange}
            style={{ width: "500px" }}
          />
          <Button
            variant="outlined"
            style={{ padding: "19px 15px", border: "2px solid #fff" }}
            onClick={handleInput}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 448 512"
              fill="#fff"
            >
              <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
            </svg>
          </Button>
        </div>
      </div>
      <TranscriptModalDialog
        open={open}
        setOpen={setOpen}
        user={"Hello"}
        avatar={"Hi"}
      />
    </div>
  );
};

export default ResponsiveGrid;
