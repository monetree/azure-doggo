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

import { useEffect, useRef, useState } from "react";

import { GOOGLE_CLOUD_API_KEY } from "../context/constants";

import { sendRequestToGoogleCloudApi } from "./network";
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


  const setOnSpeechFoundCallback = (callback: SpeechFoundCallback) => {
    onSpeechFoundCallback.current = callback;
  };

 
  useEffect(() => {
    // startRecording();
}, []);

  const [talkStarted, setTalkStarted] = useState(false);
  const [volumes, setVolumes] = useState([]);

  const answerNow = async () => {
    console.log("mediaRecorder.current", mediaRecorder.current.stream);
    if (mediaRecorder.current) {
      await stopRecording();
      
      await new Promise((resolve) => {
        if (mediaRecorder.current) {
          mediaRecorder.current.onstop = () => {
            resolve(null);
          };
        }
      });

      
      const blob = new Blob(recordedChunks.current, { type: "audio/webm" });
      console.log("blob", blob);
      recordedChunks.current = [];
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = reader.result?.toString().split(",")[1];
        console.log("base64Data", base64Data);
        if (base64Data) {
          // await recognize(base64Data);
        }

        mediaRecorder.current.start();
      };
    }
  };
  

useEffect(()=>{
}, [transcript])

  useEffect(() => {
    // let vol_ = volumes.slice(Math.max(volumes.length - 3, 0));
    const nums = volumes.filter((val) => val !== 0);
    if (!nums.length){ 

      return;}
    if (volumes.length > 10) {

      const last_1 = volumes[volumes.length - 1];
      const last_2 = volumes[volumes.length - 2];
      if (!last_1 && !last_2) {
        stopRecording();
        setVolumes([]);
      }
    }
  }, [volumes]);

  useEffect(() => {
    let animationFrameId: number | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const animationLoop = () => {
      if (!analyser.current) return;

      analyser.current.fftSize = 32;
      const bufferLength = analyser.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.current.getByteFrequencyData(dataArray);

      const avgVolume =
        dataArray.reduce((acc, val) => acc + val) / bufferLength;
      if (avgVolume > 50) {
        setTalkStarted(true);
        setVolumes((prevArray) => [...prevArray, 1]);
      } else {
        setVolumes((prevArray) => [...prevArray, 0]);
      }

      timeoutId = setTimeout(() => {
        animationFrameId = requestAnimationFrame(animationLoop);
      }, 1000);
    };

    if (characterState === CharacterState.Listening) {
      animationLoop();
    } else {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    }

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [characterState, bars, analyser]);

  useEffect(() => {
    let animationFrameId: number | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const animationLoop = () => {
      if (!analyser.current) return;

      analyser.current.fftSize = 32;
      const bufferLength = analyser.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      analyser.current.getByteFrequencyData(dataArray);

      const avgVolume =
        dataArray.reduce((acc, val) => acc + val) / bufferLength;
      const maxHeight = 80;

      if (avgVolume > 50) {
        talkingHead.setIsThinking(true);
      }

      bars.current.forEach((bar, index) => {
        if (bar) {
          let height = (avgVolume / 255) * maxHeight;
          let marginTop = 0;
          if (index !== 1) {
            height *= 0.7;
          }
          height = Math.max(height, 6);
          marginTop = (maxHeight - height) / 2;
          bar.style.height = `${height}px`;
          bar.style.marginTop = `${marginTop}px`;
        }
      });

      timeoutId = setTimeout(() => {
        animationFrameId = requestAnimationFrame(animationLoop);
      }, 50);
    };

    if (characterState === CharacterState.Listening) {
      animationLoop();
    } else {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    }

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [characterState, bars, analyser]);

  // const recognize = async (audioString: string) => {
  //   const voice = sessionStorage.getItem("voice") || null;

  //   await sendRequestToGoogleCloudApi(
  //     "https://speech.googleapis.com/v1p1beta1/speech:recognize",
  //     {
  //       config: {
  //         encoding: "WEBM_OPUS",
  //         sampleRateHertz: 48000,
  //         audioChannelCount: 1,
  //         enableAutomaticPunctuation: true,
  //         languageCode: voice ? JSON.parse(voice)["languageCodes"][0] : "en-US",
  //         profanityFilter: true,
  //       },
  //       audio: { content: audioString },
  //     },
  //     GOOGLE_CLOUD_API_KEY
  //   ).then((response) => {
  //     if (response !== null && response.results !== undefined) {
  //       const topTranscriptionAlternative = response.results[0];
  //       const transcript =
  //         topTranscriptionAlternative.alternatives[0].transcript;
  //       onSpeechFoundCallback.current(transcript);
  //     }
  //   });
  // };
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

      stopRecording();
      setCharacterState(CharacterState.Idle);
        }
  };

  return {
    characterState,
    bars,
    setCharacterState,
    onMicButtonPressed,
    setOnSpeechFoundCallback,
    startRecording,
    stopRecording,
  };
};

export default useSpeechRecognition; 