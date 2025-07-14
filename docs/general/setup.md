# Setup

There are multiple ways to get started with this project. Choose the one that fits your setup and preferences:

- **Local System**: Ideal if you have Docker installed. All services run in containers.
- **Dev Containers**: Works inside VS Code with Docker. Lightweight and customizable.
- **GitHub Codespaces**: Best for cloud-based usage or demos from constrained environments.

> **Note:** While Dev Containers and Codespaces are supported, the local Docker CLI flow is the most tested and optimized.

---

## Prerequisites

- Docker and Docker Compose installed
- Python 3.x (if using the local system for development)
- VS Code for Dev Containers and Codespaces use

---

## Local Setup (Preferred)

> Note that I have used a Raspberry Pi for the entire development. The `./scripts/dev-env` script should abstract away this quirk, but let me know if it doesn't.

**Step 1:** Locate the sample environment file:  
```bash
tooling/dev/.env.dev.merged.sample
```

**Step 2:** Update entries marked with `xxxxx`. You may need to create accounts and generate API keys for Razorpay and Google Cloud Platform (GCP).

**Step 3:** Rename the sample file:  
```bash
mv tooling/dev/.env.dev.merged.sample tooling/dev/.env.dev.merged
```

> `envtool` is a CLI that helps manage `.env` files across services. It can **merge** service-specific `.env` files into a single view, **split** them back into per-service files, and generate masked `.env.*.sample` files for sharing. Run it from `./scripts/envtool`.

**Step 4:** Split the merged file into per-service files:  
```bash
./scripts/envtool dev --split
```

**Step 5:** Verify contents in:  
```bash
tooling/dev/targets.json
```

> `dev-env` is a CLI built around Docker Compose to reduce typing when starting services. Additional parameters for Docker and Compose can be passed in nearly all commands. Run `./scripts/dev-env --help` to know more.

**Step 6:** Start dependency services:  
```bash
./scripts/dev-env start services -d
```

**Step 7:** Build and start the app:  
```bash
./scripts/dev-env start app --watch
```

**Step 8:** Run unit tests for the API (via the test-runner container):  
```bash
./scripts/dev-env test api
```

Note: Unit tests are built so that specific sections of the app can be tested individually.

> **Why is this approach preferred**
> 
> 1. This approach produces app containers without any additional items such as git, github cli, etc. 
> 2. Container spins up fast if package.json file is not modified
> 3. Can connect easily to other containers using dev-env CLI
> 4. Developer brings his own toolkit for non-essential preferences, e.g., database connectivity, editor enhancements, etc
>
> **Why this may not work for everyone**
> 
> 1. npm install ... will not add and activate new packages inside running containers and containers need to be built fresh 

### Dev Containers

**Best for:**

- Local development inside VS Code
- Systems without global Python
- Fully isolated and customizable setups

**Notes:**

- `.env` files must be created manually (Follow steups 3 and 4 in Local setup above)
- Can’t run Python-based CLIs unless Python is installed inside the container

### Codespaces
**Best for:**

- Cloud-based development or demos
- Working from any device without setup
- Systems with limited permissions

**Notes:**

- Automatically runs `envtool dev --split-sample` to generate `.env` files (excluding masked secrets). 
- Masked secrets must be set using [user-level Codespaces secrets](https://docs.github.com/en/codespaces/managing-your-codespaces/managing-secrets-for-your-codespaces)
- The full list of masked secrets is defined in `tooling/dev/envconfig.json`

---

## How to Use Dev Containers / Codespaces

1. Open VS Code → Remote Containers → “Reopen in Container”
2. Choose:
   - Dev Container: `.devcontainer/local/devcontainer.json`
   - Codespaces: `.devcontainer/github/devcontainer.json`
3. For Codespaces:
   - `.env` files are auto-generated (excluding masked values)
   - Add masked secrets manually via GitHub UI
4. For Dev Containers:
   - Manually create `.env` files or run `envtool` if Python is available
5. Start the app (Codespace only)
    ```bash
    npm run dev
    ```
6. To run unit tests (no npm shortcuts):

    ```bash
    npx jest --config server/api/tests/jest.config.mjs
    ```

---

## Common Issues

- *Database containers fail to start*

  Here are the steps to resolve:
  1. Delete `.gitkeep` files in `db/mongodb` and `db/postgres` folders
  2. If you are on WSL, you may need to update compose files to use named volumes instead of mounting folders (This is not required on MacOS or Linux)

- *Running dev-env or envtool throws error `/usr/bin/env: 'python3/r': No such file or directory`*

  This error does occur on WSL 2, depending on environment setup. Run the scripts as follows:
  `python3 ./scripts/dev-env ...` or
  `python ./scripts/dev-env ...`

---

## Tips for Advanced Users

- `dev-env` supports passthrough of Docker and Compose arguments
- Container startup is optimized using a base image with cached `node_modules`
- No build artifacts (`.nuxt`, `node_modules`, etc.) are stored on host
- Great for custom scripting, isolated test containers, and parallel workflows

---

Let me know if anything breaks — especially if you're using a setup other than Raspberry Pi!