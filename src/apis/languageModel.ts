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

import { useContext, useEffect, useState } from "react";

import { ConfigContext } from "../context/config";
import {
  LANGUAGE_MODEL_API_KEY,
  LANGUAGE_MODEL_URL,
} from "../context/constants";
import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";
import { BufferMemory } from "langchain/memory";
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
  let prevResponse = "";

// Langchain variables
const api_key = process.env.REACT_APP_OPENAI_API_KEY;

  const chat = new ChatOpenAI({openAIApiKey: api_key,temperature: 0});
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `You are a very smart and funny teacher. Your task is 
      to acting as a teacher for various subjects. 
      Please give precise answers for the questions you are asked. 
      Don't make it more than 30 words.`
      ),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);

  // Return the current conversation directly as messages and insert them into the MessagesPlaceholder in the above prompt.
  const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: "history"
  });

  const chain = new ConversationChain({
    memory,
    prompt: chatPrompt,
    llm: chat,
    // verbose: true,
  });

  const sendPrompt = async (human_message) => {
    const result = await chain.call({
      input: human_message,
      // history: "The history of the chat coming from database.",
    });
    return result
  };

  useEffect(() => {
    context = `Your task is to acting as a character that has this personality: "${config.state.personality}". Your response must be based on your personality. You have this backstory: "${config.state.backStory}". Your knowledge base is: "${config.state.knowledgeBase}". The response should be one single sentence only.`;
  }, [config]);

  const sendMessage = async (human_message: string): Promise<string> => {


    const response = await sendPrompt(human_message);
    console.log('The Response from the bot is: ', response.response)
    return response.response;
  };

  return {
    sendMessage,
  };
};

export default useLanguageModel;
