# Contributing Guidelines

Thanks for checking out this project!

This is a solo developer project built for learning, reference, and experimentation.  
You’re welcome to:

- Clone it  
- Fork it  
- Use it as a foundation for your own work

---

## Prerequisites

- Docker and Docker Compose installed
- Python 3.x (if using the local system for development)
- VS Code for Dev Containers and Codespaces use

---

## Getting Started

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
./scripts/dev-env start app -d
```

**Step 8:** Run unit tests for the API (via the test-runner container):  
```bash
./scripts/dev-env test api
```

Note: Unit tests are built so that specific sections of the app can be tested individually.

---

## Using Dev Containers and Codespaces

I've spent quite some time figuring out Dev Containers and Codespaces for this project. Personally, I prefer using the host system directly for development using the `dev-env` CLI, for the following reasons:

1. Compiling and running are faster and less error-prone. The container running the app is separate from the one used for development (this separation can be bypassed, but requires Docker-in-Docker or complex setups).
2. The full power of multiple Docker containers is available — including test, ad hoc scripts, etc., which can run in parallel to the main application.
3. I can use any VS Code extensions and plugins I want, or any editor of my choice.
4. I've split Dockerfiles to include a base Dockerfile that runs `npm install`, which speeds up container startup by caching dependencies.
5. Generated folders such as `.nuxt`, `node_modules`, etc., are not created on the host (Dev Containers and Codespaces are set up to only create empty mount points).
6. Modern Docker and Docker Compose features, such as base images, are supported.
7. With sensible defaults, even advanced users can use the `dev-env` CLI with minimal typing for common use cases.
8. By enabling passthrough of Docker commands, Jest options, and container commands, full control of underlying tools is available when needed.

### Where Dev Containers Win

1. Feels like developing on a local system, with all necessary tools included (I haven't done this because it is not my primary dev setup).
2. No performance penalty or usage limits since the local system is being used.
3. Does not require Python (but also cannot run CLI scripts).
4. Great for systems where users don't have admin access.

### Where Codespaces Win

1. Feels like developing on a local system, with all necessary tools included (I haven't done this because it is not my primary dev setup).
2. Enables cloud-based development from anywhere.
3. Great for systems where users don't have admin access.

### How to Use Dev Containers / Codespaces

1. Click to connect to a remote container in VS Code.
2. For Codespaces, select `.devcontainer/github/devcontainer.json` to create the container. For local Dev Containers, select `.devcontainer/local/devcontainer.json`.
3. The Codespaces container runs an init script to generate the required `.env` files (excluding masked secrets). Masked secrets must be defined as [user-level Codespaces secrets](https://docs.github.com/en/codespaces/managing-your-codespaces/managing-secrets-for-your-codespaces). The full list of masked secrets is available in `tooling/dev/envconfig.json`.  
   > I recommend using user-level secrets instead of repository-level secrets to avoid leaking credentials.
4. The local Dev Container does not generate `.env` files automatically. Developers are expected to create them. If Python is installed, follow Steps 1–4 in the **Getting Started** section.
5. You can run unit tests but there are no npm shortcuts. Run it as:
    ```bash
    npx jest --config server/api/tests/jest.config.mjs
    ```

---

## Contributions

**Pull requests are not accepted.**  
This project follows a personal roadmap for my learning and is evolving rapidly.

✅ **Issues, suggestions, and bug reports are welcome.**  
Feel free to open a GitHub Issue if you spot a bug or have a helpful idea.

While I may not respond to everything, I appreciate thoughtful feedback.

---

## License and Usage

This project is shared under the [MIT License](./LICENSE).  
Feel free to use or adapt it — attribution is appreciated but not required.
