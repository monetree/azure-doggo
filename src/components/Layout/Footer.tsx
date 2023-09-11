import useSpeechRecognition, {
  CharacterState,
} from "../../apis/speechRecognition";
import useLanguageModel from "../../apis/languageModel";
import { useEffect, useState } from "react";
import useTextToSpeech from "../../apis/textToSpeech";
import * as talkingHead from "../../apis/talkingHead";
import TextField from "@mui/material/TextField";

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

  const { convert, setOnProcessCallback } = useTextToSpeech();

  const { sendMessage } = useLanguageModel();
  talkingHead.runBlendshapesDemo(false);
  const [transcript, setTranscript] = useState<String[]>(["You", ""]);
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: any) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    setOnProcessCallback((audioData: Float32Array) => {
      talkingHead.registerCallback(audioData);
    });
    setOnSpeechFoundCallback((transcription: string) => {
      setTranscript(["You", transcription]);
      console.log("You", transcription);
      sendMessage(transcription).then((result) => {
        setTranscript(["Buddy", result]);
        console.log("Buddy", result);
        convert(result).then(() => {
          setCharacterState(CharacterState.Idle);
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
    e.preventDefault();

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
          marginLeft: "30px",
          cursor: "pointer",
        }}
        onClick={startRecording}
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
          marginLeft: "30px",
          cursor: "pointer",
        }}
        onClick={stopRecording}
      >
        <span className="mat-button-wrapper">
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
        </span>
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
          border: "1px solid #fff",
          marginRight: "10px",
          marginLeft: "30px",
          cursor: "pointer",
        }}
        onClick={stopRecording}
      >
        <span className="mat-button-wrapper">
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
        <form onSubmit={handleInput}>
          <TextField
            id="outlined-basic"
            label="Type your question here .. "
            variant="outlined"
            value={inputValue}
            onChange={handleChange}
          />
        </form>
      </div>

      <div
        className={"action-wrapper action-btns"}
        style={{
          alignItems: "center",
          bottom: "45px",
          display: "flex",
          left: "26px",
          position: "absolute",
        }}
      >
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
          marginLeft: "30px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0V4z"></path>
        </svg>
      </button> */}

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
          marginLeft: "30px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"></path>
        </svg>
      </button> */}

        {characterStateIcon[characterState]}
        {characterStateBits[characterState]}
        {/* {transcript[1]} */}

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
        onClick={() => setCharacterState(CharacterState.Idle)}
      >
        <span className="mat-button-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0V4z"></path>
          </svg>
        </span>
        <span className="mat-ripple mat-button-ripple mat-button-ripple-round"></span>
        <span className="mat-button-focus-overlay"></span>
      </button> */}

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
            cursor: "pointer",
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
        </button>

        <div className="form-container">
          <form onSubmit={handleInput}>
            <TextField
              id="standard-basic"
              label="Type your question here .. "
              variant="standard"
              value={inputValue}
              onChange={handleChange}
            />
          </form>
        </div>

        {/* <form onSubmit={handleInput}>
        <div className="input-group">
          <input
            id="input"
            value={input}
            className="form-control"
            placeholder="Type your message here ..."
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="btn send-button"
            type="submit"
            aria-label="Submit"
            data-tip="Submit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="1em"
              height="1em"
              fill="currentColor"
            >
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
            </svg>
          </button>
        </div>
      </form> */}
      </div>
    </div>
  );
};

export default ResponsiveGrid;