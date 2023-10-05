
import { useEffect, useRef, useState } from "react";
import * as talkingHead from "./talkingHead";
import { useWhisper } from '@chengsokdara/use-whisper'

interface SpeechFoundCallback {
  (text: string): void;
}

export enum CharacterState {
  Idle,
  Listening,
  Speaking,
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

const useSpeechRecognition = () => {
  const [characterState, setCharacterState] = useState<CharacterState>(
    CharacterState.Idle
  );
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const onSpeechFoundCallback = useRef<SpeechFoundCallback>((text) => {});
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  let stream = useRef<MediaStream | null>(null);
  const source = useRef<MediaStreamAudioSourceNode | null>(null);
  const bars = useRef<(HTMLDivElement | null)[]>([]);
  

  const [conversationStarted, setConversationStarted] = useState(false)

  const {
    recording,
    speaking,
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        
  })
  const previousTranscriptRef = useRef(transcript);


  useEffect(() => {
    if(speaking){
      setConversationStarted(true)
    }
  },[speaking])


  useEffect(() => {
    if(conversationStarted && !speaking){
      alert(1)
      stopRecording() 
    }
  },[conversationStarted, speaking])

  

  const setOnSpeechFoundCallback = (callback: SpeechFoundCallback) => {
    onSpeechFoundCallback.current = callback;
  };



  useEffect(() => {
    if(transcript && transcript.text){
      onSpeechFoundCallback.current(transcript.text);
      startRecording()
    }
  },[transcript])


  useEffect(() => {
    if (transcript !== previousTranscriptRef.current) {
        onSpeechFoundCallback.current(transcript.text);
        previousTranscriptRef.current = transcript;
    }
    
}, [characterState, transcript]);


  const onMicButtonPressed = async() => {
    if (characterState === CharacterState.Idle) {
      startRecording();
      setCharacterState(CharacterState.Listening);
    } else if (characterState === CharacterState.Listening) {
      setCharacterState(CharacterState.Idle);
    }
  };

  return {
    characterState,
    bars,
    setCharacterState,
    onMicButtonPressed,
    setOnSpeechFoundCallback,
  };
};

export default useSpeechRecognition; 