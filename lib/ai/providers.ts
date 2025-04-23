import { google } from '@ai-sdk/google';
import {
  customProvider
} from 'ai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        // 'chat-model': openai('gpt-4o'),
        // 'chat-model-reasoning': openai('gpt-4o'),
        // 'title-model': openai('gpt-4o'),
        // 'artifact-model': openai('gpt-4o'),
        'chat-model': google('gemini-2.0-flash-001'),
        'chat-model-reasoning': google('gemini-2.0-flash-001'),
        'title-model': google('gemini-2.0-flash-001'),
        'artifact-model': google('gemini-2.0-flash-001'),
      },
      // imageModels: {
      //   'small-model': xai.image('grok-2-image'),
      // },
    });
