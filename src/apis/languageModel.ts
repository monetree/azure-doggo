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

import { useContext, useEffect } from "react";

import { ConfigContext } from "../context/config";
import {
  LANGUAGE_MODEL_API_KEY,
  LANGUAGE_MODEL_URL,
} from "../context/constants";

/**
 * Represents a message object with an author and content.
 * @interface
 * @property {string} author - The author of the message.
 * @property {string} content - The content of the message.
 */
export interface MessageProps {
  author: string;
  content: string;
}

/**
 * Represents an example object that defines the expected input and output for a
 * prompt.
 * @interface
 * @property {string} input.content - The content of the input for the example.
 * @property {string} output.content - The expected output content for the
 * example.
 */
export interface ExampleProps {
  input: { content: string };
  output: { content: string };
}

/**
 * Represents the properties for a prompt object, which contains a context,
 * examples, and a list of messages.
 * @interface
 * @property {string} [context] - The context for the prompt.
 * @property {ExampleProps[]} [examples] - An array of example objects that
 * define the expected input and output of the prompt.
 * @property {MessageProps[]} messages - An array of message objects that
 * represent the prompt's messages.
 */
export interface PromptProps {
  context?: any;
}

/**
 * Represents the response object returned by the sendPrompt function.
 * @interface
 * @property {MessageProps[]} messages - An array of message objects that
 * represent the prompt's messages.
 * @property {MessageProps[]} candidates - An array of message objects that
 * represent the potential responses to the prompt.
 */
export interface SendPromptResponse {
  candidates: MessageProps[];
  messages: MessageProps[];
}

type LanguageModel = {
  sendMessage: (message: string) => Promise<string>;
};

const useLanguageModel = (): LanguageModel => {
  const config = useContext(ConfigContext);

  let context = "";
  let messages: MessageProps[] = [];

  const sendPrompt = async (payload: any) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${LANGUAGE_MODEL_API_KEY}`);
    myHeaders.append("Content-Type", "application/json");
    const response = await fetch(LANGUAGE_MODEL_URL, {
      headers: myHeaders,
      body: JSON.stringify(payload),
      method: "POST",
    });
    return response.json();
  };

  useEffect(() => {
    context = `Your task is to acting as a character that has this personality: "${config.state.personality}". Your response must be based on your personality. You have this backstory: "${config.state.backStory}". Your knowledge base is: "${config.state.knowledgeBase}". The response should be one single sentence only.`;
  }, [config]);

  const sendMessage = async (message: string): Promise<string> => {
    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a virtual teacher. Answer question in 50 words.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    };

    const response = await sendPrompt(payload);
    return response.choices[0].message.content;
  };

  return {
    sendMessage,
  };
};

export default useLanguageModel;
