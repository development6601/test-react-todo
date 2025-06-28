# LLM Client

A robust, type-safe, provider-agnostic client for interacting with LLM providers including OpenAI, Anthropic, and Google.

## Installation

```bash
npm install @deduplicode/llm-client
```

## Basic Usage

```typescript
import { LLMClient } from '@deduplicode/llm-client';

// Initialize with your preferred provider
const client = await LLMClient.create({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate text
const response = await client.generate({
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'user', content: 'Explain quantum computing in simple terms.' }
  ],
});

console.log(response.choices[0].message.content);
```

## TypeScript Support

This package is built with TypeScript and includes comprehensive type definitions for all exported modules. Here are some of the key benefits:

### Type Guards

The package includes type guards to help with type narrowing:

```typescript
import { LLMConfig, isOpenAIConfig, isAnthropicConfig, isGoogleConfig } from '@deduplicode/llm-client';

function handleConfig(config: LLMConfig) {
  if (isOpenAIConfig(config)) {
    // config is now narrowed to OpenAIConfig
    console.log(config.organization); // OpenAI-specific property
  } else if (isAnthropicConfig(config)) {
    // config is now narrowed to AnthropicConfig
    console.log(config.anthropicVersion); // Anthropic-specific property
  } else if (isGoogleConfig(config)) {
    // config is now narrowed to GoogleConfig
    console.log(config.projectId); // Google-specific property
  }
}
```

### Exported Types

All core types are exported from the package, allowing you to use them in your own code:

```typescript
import { 
  GenerateOptions, 
  GenerateResponse, 
  Message,
  ToolDefinition
} from '@deduplicode/llm-client';

// Create a strongly-typed request
const options: GenerateOptions = {
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Tell me about TypeScript.' }
  ],
  temperature: 0.7
};
```

### IDE Integration

The included TypeScript definitions provide rich IntelliSense support in compatible editors like VS Code, offering:

- Autocomplete for all methods and properties
- Parameter hints and documentation
- Type checking to catch errors during development

## Provider Configuration

### OpenAI

```typescript
import { LLMClient, OpenAIConfig } from '@deduplicode/llm-client';

const config: OpenAIConfig = {
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  defaultModel: 'gpt-4',
  organization: 'your-org-id', // Optional
  baseURL: 'https://api.openai.com/v1', // Optional custom endpoint
  maxRetries: 3,
  timeout: 30000, // 30 seconds
  monitoring: {
    logLevel: 'info',
    enabled: true,
    enableMetrics: false,
    enableTracing: false,
  }
};

const client = await LLMClient.create(config);
```

### Anthropic

```typescript
import { LLMClient, AnthropicConfig } from '@deduplicode/llm-client';

const config: AnthropicConfig = {
  provider: 'anthropic',
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultModel: 'claude-3-haiku-20240307',
  baseURL: 'https://api.anthropic.com', // Optional
  anthropicVersion: '2023-06-01', // Optional API version
  maxRetries: 2,
  monitoring: {
    logLevel: 'debug',
    enabled: true,
  }
};

const client = await LLMClient.create(config);
```

### Google

```typescript
import { LLMClient, GoogleConfig } from '@deduplicode/llm-client';

const config: GoogleConfig = {
  provider: 'google',
  apiKey: process.env.GOOGLE_API_KEY,
  defaultModel: 'models/gemini-1.5-flash-8b',
  monitoring: {
    logLevel: 'info',
    enabled: true,
  }
};

const client = await LLMClient.create(config);
```

## Advanced Features

### Streaming Responses

```typescript
import { LLMClient } from '@deduplicode/llm-client';

const client = await LLMClient.create({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
});

// Stream responses for real-time display
const streamOptions = {
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: 'Write a short poem about AI.' }],
  stream: true,
};

let fullResponse = '';
for await (const chunk of client.generateStream(streamOptions)) {
  if (chunk.choices && chunk.choices.length > 0) {
    const content = chunk.choices[0].delta?.content;
    if (content) {
      process.stdout.write(content);
      fullResponse += content;
    }
  }
}
console.log('\nFull response:', fullResponse);
```

### Function Calling

```typescript
import { LLMClient, FunctionDefinition } from '@deduplicode/llm-client';

const client = await LLMClient.create({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
});

const functions: FunctionDefinition[] = [
  {
    name: 'get_weather',
    description: 'Get the current weather in a given location',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'The city and state, e.g. San Francisco, CA',
        },
        unit: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
          description: 'The temperature unit to use',
        },
      },
      required: ['location'],
    },
  },
];

const response = await client.generate({
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'user', content: 'What\'s the weather like in Boston?' }
  ],
  functions,
  functionCall: 'auto', // or { name: 'get_weather' } to force a specific function
});

// Handle function call in response
const functionCall = response.choices[0].message.function_call;
if (functionCall) {
  console.log('Function to call:', functionCall.name);
  console.log('Arguments:', JSON.parse(functionCall.arguments));
  
  // Implement your function handler here
  // const result = await yourFunctionHandler(functionCall.name, JSON.parse(functionCall.arguments));
  
  // Send function result back to LLM
  const followUpResponse = await client.generate({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'user', content: 'What\'s the weather like in Boston?' },
      { 
        role: 'assistant', 
        content: null,
        function_call: functionCall
      },
      {
        role: 'function',
        name: 'get_weather',
        content: JSON.stringify({ temperature: 72, unit: 'fahrenheit', description: 'Sunny' })
      }
    ]
  });
  
  console.log('Final response:', followUpResponse.choices[0].message.content);
}
```

### Tool Calling (OpenAI & Google)

```typescript
import { LLMClient, ToolDefinition } from '@deduplicode/llm-client';

const client = await LLMClient.create({
  provider: 'openai', // Works with OpenAI and Google providers
  apiKey: process.env.OPENAI_API_KEY,
});

const tools: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'get_stock_price',
      description: 'Get the current stock price',
      parameters: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description: 'The stock symbol, e.g. AAPL',
          },
        },
        required: ['symbol'],
      },
    },
  },
];

const response = await client.generate({
  model: 'gpt-4',
  messages: [
    { role: 'user', content: 'What\'s the current price of Apple stock?' }
  ],
  tools,
  toolChoice: 'auto', // or { type: 'function', function: { name: 'get_stock_price' } }
});

// Handle tool calls
if (response.choices[0].message.tool_calls?.length) {
  const toolCalls = response.choices[0].message.tool_calls;
  
  // Process each tool call
  for (const toolCall of toolCalls) {
    console.log('Tool to call:', toolCall.function.name);
    console.log('Arguments:', JSON.parse(toolCall.function.arguments));
    
    // Implement your tool handler
    // const result = await yourToolHandler(toolCall.function.name, JSON.parse(toolCall.function.arguments));
    
    // For this example, mock a result
    const mockResult = { price: 198.45, currency: 'USD' };
    
    // Send tool result back
    const followUpMessages = [
      ...response.choices[0].message.tool_calls.map(tc => ({
        role: 'tool' as const,
        tool_call_id: tc.id,
        content: JSON.stringify(mockResult)
      }))
    ];
    
    const finalResponse = await client.generate({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: 'What\'s the current price of Apple stock?' },
        response.choices[0].message,
        ...followUpMessages
      ]
    });
    
    console.log('Final response:', finalResponse.choices[0].message.content);
  }
}
```

## Key Interfaces

### LLMClient

```typescript
class LLMClient {
  static async create(config: LLMConfig): Promise<LLMClient>;
  async generate(options: GenerateOptions): Promise<GenerateResponse>;
  async *generateStream(options: GenerateOptions): AsyncGenerator<StreamChunk, void, undefined>;
  async listModels(): Promise<ModelInfo[]>;
  async getModelInfo(modelId: string): Promise<ModelInfo | null>;
  async healthCheck(): Promise<HealthCheckResult>;
}
```

### Provider Configs

```typescript
interface BaseConfig {
  provider: 'openai' | 'anthropic' | 'google';
  apiKey: string;
  defaultModel?: string;
  maxRetries?: number;
  timeout?: number;
  monitoring?: {
    logLevel?: 'debug' | 'info' | 'warn' | 'error';
    enabled?: boolean;
    enableMetrics?: boolean;
    enableTracing?: boolean;
  };
}

interface OpenAIConfig extends BaseConfig {
  provider: 'openai';
  organization?: string;
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
  defaultQueryParameters?: Record<string, string>;
}

interface AnthropicConfig extends BaseConfig {
  provider: 'anthropic';
  baseURL?: string;
  anthropicVersion?: string;
  defaultHeaders?: Record<string, string>;
}

interface GoogleConfig extends BaseConfig {
  provider: 'google';
}
```

### GenerateOptions

```typescript
interface GenerateOptions {
  model?: string;
  messages: Message[];
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  stream?: boolean;
  stop?: string | string[];
  presencePenalty?: number;
  frequencyPenalty?: number;
  systemPrompt?: string; // Used by Anthropic
  functions?: FunctionDefinition[];
  functionCall?: string | { name: string };
  tools?: ToolDefinition[];
  toolChoice?: string | { type: string; function: { name: string } };
  userId?: string;
}
```

### Message

```typescript
interface Message {
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool';
  content: string | null;
  name?: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  function_call?: FunctionCall;
}

interface ToolCall {
  id?: string;
  type: 'function';
  function: {
    name?: string;
    arguments: string;
  };
}

interface FunctionCall {
  name: string;
  arguments: string;
}
```

### Response Types

```typescript
interface GenerateResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage?: TokenUsage;
  systemFingerprint?: string;
}

interface Choice {
  index: number;
  message: Message;
  finishReason: FinishReason | null;
  logprobs: any | null;
}

interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: StreamChoice[];
  systemFingerprint?: string;
}

interface StreamChoice {
  index: number;
  delta: Partial<Message>;
  finishReason: FinishReason | null;
}

type FinishReason = 'stop' | 'length' | 'content_filter' | 'function_call' | 'tool_calls' | null;
```

## Error Handling

The library provides typed errors for better handling:

```typescript
import { LLMClient, LLMError, ErrorCode } from '@deduplicode/llm-client';

try {
  const client = await LLMClient.create({
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  const response = await client.generate({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Hello' }],
  });
} catch (error) {
  if (error instanceof LLMError) {
    switch (error.code) {
      case 'AUTHENTICATION_ERROR':
        console.error('Authentication failed. Check your API key.');
        break;
      case 'PERMISSION_ERROR':
        console.error('You don\'t have permission to use this model.');
        break;
      case 'RATE_LIMIT_ERROR':
        console.error('Rate limit exceeded. Try again later.');
        // Implement backoff strategy
        break;
      case 'PROVIDER_UNAVAILABLE':
        console.error('Provider API is currently unavailable.');
        // Fallback to another provider
        break;
      case 'VALIDATION_ERROR':
        console.error('Invalid request parameters:', error.message);
        break;
      default:
        console.error('Error:', error.code, error.message);
    }
    
    // Check if the error is retryable
    if (error.isRetryable) {
      console.log('This error is retryable. Implementing backoff...');
    }
    
    // Access original provider error if needed
    if (error.originalError) {
      console.error('Original provider error:', error.originalError);
    }
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Environment Setup

Create a `.env` file in your project root:

```
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Google
GOOGLE_API_KEY=...
```

Then load it in your application:

```typescript
import dotenv from 'dotenv';
dotenv.config();

// Now you can access process.env.OPENAI_API_KEY etc.
```

## Model Information

List available models for a provider:

```typescript
const client = await LLMClient.create({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
});

const models = await client.listModels();
console.log('Available models:', models.map(m => m.id));

// Get detailed information about a specific model
const modelInfo = await client.getModelInfo('gpt-4');
console.log('Model details:', modelInfo);
```

## Health Checks

Verify provider connectivity:

```typescript
const client = await LLMClient.create({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
});

const healthResult = await client.healthCheck();
console.log('Provider health:', healthResult.status); // 'healthy' or 'unhealthy'

if (healthResult.status === 'unhealthy') {
  console.error('Provider is unhealthy:', healthResult.error);
}
```

## TypeScript Support

This package is written in TypeScript and provides full type definitions. When consuming this package in a TypeScript project, you'll get complete IntelliSense and type checking for all interfaces, methods, and parameters.

### Importing Types

All types are exported from the package root, so you can import them directly:

```typescript
import { 
  LLMClient, 
  GenerateOptions, 
  GenerateResponse,
  Message,
  Choice,
  StreamChunk,
  ToolDefinition,
  FunctionDefinition,
  OpenAIConfig,
  AnthropicConfig,
  GoogleConfig,
  LLMError,
  ErrorCode
} from '@deduplicode/llm-client';
```

### Using Type Guards

The package provides type guards to ensure type safety at runtime:

```typescript
import { isOpenAIConfig, isAnthropicConfig, isGoogleConfig } from '@deduplicode/llm-client';

function configureProvider(config: any) {
  if (isOpenAIConfig(config)) {
    // TypeScript knows config is OpenAIConfig here
    console.log('Using OpenAI with model:', config.defaultModel);
    return new OpenAIProvider(config);
  } else if (isAnthropicConfig(config)) {
    // TypeScript knows config is AnthropicConfig here
    console.log('Using Anthropic with version:', config.anthropicVersion);
    return new AnthropicProvider(config);
  } else if (isGoogleConfig(config)) {
    // TypeScript knows config is GoogleConfig here
    return new GoogleProvider(config);
  }
  
  throw new Error('Invalid provider configuration');
}
```

## Package Exports

This package uses the dual CommonJS/ESM format to support both module systems. The package.json is configured with the following exports:

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/cjs/index.cjs",
      "types": "./dist/index.d.ts"
    }
  }
}
```

This ensures that:
- ESM imports (`import { LLMClient } from '@deduplicode/llm-client'`) work in ESM projects
- CommonJS imports (`const { LLMClient } = require('@deduplicode/llm-client')`) work in CommonJS projects
- TypeScript type definitions are available in both module systems

All public interfaces and types are exported from the main entry point (index.ts), making them available to consumers of the package.

## Provider-Specific Features

### OpenAI

- **Function and Tool Calling**: Full support for function and tool calling APIs
- **JSON Mode**: Set `responseFormat: { type: 'json_object' }` to ensure JSON responses
- **Streaming**: Supports token-by-token streaming
- **Vision**: Support for image inputs using content parts (multimodal)

### Anthropic

- **System Instructions**: Pass system instructions via `systemPrompt` or as a system message
- **Tool Use**: Support for Claude's tool use API
- **Streaming**: Supports token-by-token streaming
- **Vision**: Support for image inputs using content parts (multimodal)

### Google (Gemini)

- **Safety Settings**: Configure safety thresholds
- **Streaming**: Supports token-by-token streaming
- **Multimodal**: Support for image and video inputs

## Development

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/cursorai/llm-client.git
cd llm-client
npm install
```

### Building

```bash
npm run build
```

This will:
1. Clean the dist directory
2. Compile TypeScript to JavaScript (ESM)
3. Generate CommonJS version
4. Generate type definitions

### Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:cov

# Test a specific provider (requires API key in .env)
npm run test-openai
npm run test-anthropic
npm run test-google
```

### Linting

```bash
# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format
```

## Compatibility

- Node.js: v16.0.0 or higher
- TypeScript: v4.7.0 or higher

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request at https://github.com/cursorai/llm-client/pulls

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for their ChatGPT API
- Anthropic for their Claude API
- Google for their Gemini API

## Advanced Examples

### Tool Calling

```typescript
import { LLMClient, ToolDefinition } from '@deduplicode/llm-client';

async function main() {
  const client = await LLMClient.create({
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    defaultModel: 'gpt-4-turbo',
  });

  // Define available tools
  const tools: ToolDefinition[] = [
    {
      type: 'function',
      function: {
        name: 'get_weather',
        description: 'Get the current weather in a given location',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'The city and state, e.g., San Francisco, CA',
            },
            unit: {
              type: 'string',
              enum: ['celsius', 'fahrenheit'],
              description: 'The unit of temperature to use',
            },
          },
          required: ['location'],
        },
      },
    }
  ];

  // Request with tools
  const response = await client.generate({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'user', content: 'What\'s the weather like in San Francisco?' }
    ],
    tools,
    toolChoice: 'auto',
  });

  const choice = response.choices[0];
  
  // Handle tool calls in the response
  if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
    const toolCall = choice.message.tool_calls[0];
    
    if (toolCall.function.name === 'get_weather') {
      const args = JSON.parse(toolCall.function.arguments);
      const weatherData = await getWeatherData(args.location, args.unit || 'celsius');
      
      // Send the tool results back to continue the conversation
      const continuedResponse = await client.generate({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'user', content: 'What\'s the weather like in San Francisco?' },
          choice.message,
          { 
            role: 'tool', 
            tool_call_id: toolCall.id, 
            content: JSON.stringify(weatherData) 
          }
        ],
      });
      
      console.log(continuedResponse.choices[0].message.content);
    }
  }
}

// Mock function to get weather data
async function getWeatherData(location: string, unit: string): Promise<any> {
  // In a real application, this would call a weather API
  return {
    location,
    temperature: 72,
    unit,
    condition: 'sunny',
    humidity: 45,
  };
}
```

### Streaming with Tool Calls

```typescript
import { LLMClient, ToolDefinition, StreamChunk } from '@deduplicode/llm-client';

async function streamingExample() {
  const client = await LLMClient.create({
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
  });

  const tools: ToolDefinition[] = [
    {
      type: 'function',
      function: {
        name: 'search_database',
        description: 'Search a database for information',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search query',
            },
          },
          required: ['query'],
        },
      },
    }
  ];

  // Start a streaming response
  const stream = await client.generateStream({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'user', content: 'Find information about quantum computing advances in 2023' }
    ],
    tools,
    toolChoice: 'auto',
  });

  let fullContent = '';
  let collectedToolCalls: any[] = [];

  // Process the stream
  for await (const chunk of stream) {
    for (const choice of chunk.choices) {
      // Accumulate content from text chunks
      if (choice.delta.content) {
        fullContent += choice.delta.content;
        process.stdout.write(choice.delta.content);
      }
      
      // Collect tool call data from chunks
      if (choice.delta.tool_calls) {
        for (const toolCall of choice.delta.tool_calls) {
          // Find or create a tool call entry
          let existingCall = collectedToolCalls.find(t => t.id === toolCall.id);
          if (!existingCall) {
            existingCall = { 
              id: toolCall.id, 
              type: toolCall.type, 
              function: { name: '', arguments: '' } 
            };
            collectedToolCalls.push(existingCall);
          }
          
          // Update function name if present
          if (toolCall.function.name) {
            existingCall.function.name = toolCall.function.name;
          }
          
          // Append to arguments if present
          if (toolCall.function.arguments) {
            existingCall.function.arguments += toolCall.function.arguments;
          }
        }
      }
    }
  }

  console.log('\n\nCollected tool calls:', JSON.stringify(collectedToolCalls, null, 2));
} 