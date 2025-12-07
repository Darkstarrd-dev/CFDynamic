


## ~/ => User/ at windows

Credentials
When you add a provider’s API keys with the /connect command, they are stored in ~/.local/share/opencode/auth.json.


# Model

./project/opencode.json

~/.config/opencode/opencode.json

## LM Studio

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "lmstudio": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "LM Studio (local)",
      "options": {
        "baseURL": "http://127.0.0.1:1234/v1"
      },
      "models": {
        "google/gemma-3n-e4b": {
          "name": "Gemma 3n-e4b (local)"
        }
      }
    }
  }
}
```
## Ollama

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama (local)",
      "options": {
        "baseURL": "http://localhost:11434/v1"
      },
      "models": {
        "llama2": {
          "name": "Llama 2"
        }
      }
    }
  }
}
```

## Custom provider

To add any OpenAI-compatible provider that’s not listed in the /connect command:

Run the /connect command and scroll down to Other.

$ /connect

┌  Add credential
│
◆  Select provider
│  ...
│  ● Other
└

Enter a unique ID for the provider.

$ /connect

┌  Add credential
│
◇  Enter provider id
│  myprovider
└

Enter your API key for the provider.

$ /connect

┌  Add credential
│
▲  This only stores a credential for myprovider - you will need to configure it in opencode.json, check the docs for examples.
│
◇  Enter your API key
│  sk-...
└

Create or update your opencode.json file in your project directory:

{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "myprovider": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "My AI ProviderDisplay Name",
      "options": {
        "baseURL": "https://api.myprovider.com/v1"
      },
      "models": {
        "my-model-name": {
          "name": "My Model Display Name"
        }
      }
    }
  }
}

Here are the configuration options:

npm: AI SDK package to use, @ai-sdk/openai-compatible for OpenAI-compatible providers
name: Display name in UI.
models: Available models.
options.baseURL: API endpoint URL.
options.apiKey: Optionally set the API key, if not using auth.
options.headers: Optionally set custom headers.
More on the advanced options in the example below.

Run the /models command and your custom provider and models will appear in the selection list.

### Example

Here’s an example setting the apiKey, headers, and model limit options.

{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "myprovider": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "My AI ProviderDisplay Name",
      "options": {
        "baseURL": "https://api.myprovider.com/v1",
        "apiKey": "{env:ANTHROPIC_API_KEY}",
        "headers": {
          "Authorization": "Bearer custom-token"
        }
      },
      "models": {
        "my-model-name": {
          "name": "My Model Display Name",
          "limit": {
            "context": 200000,
            "output": 65536
          }
        }
      }
    }
  }
}

Configuration details:

apiKey: Set using env variable syntax, learn more.
headers: Custom headers sent with each request.
limit.context: Maximum input tokens the model accepts.
limit.output: Maximum tokens the model can generate.
The limit fields allow OpenCode to understand how much context you have left. Standard providers pull these from models.dev automatically.
