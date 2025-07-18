# Setup

There are multiple ways to get started with this project. Choose the one that fits your setup and preferences:

- **Local System**: Ideal if you have Docker installed. All services run in containers.
- **Dev Containers**: Works inside VS Code with Docker. Lightweight and customizable.
- **GitHub Codespaces**: Best for cloud-based usage or demos from constrained environments.

> While Dev Containers and Codespaces are supported, the local Docker CLI flow is the most tested and optimized.

---

## Prerequisites

- Docker and Docker Compose installed
- Python 3.x (if using the local system for development)
- Git (if using the local system for development)
- VS Code for Dev Containers and Codespaces use

---

## Local Setup (Preferred)

> I have used a Raspberry Pi (Debian based Linux) for the entire development. However, I have tested the project in MacOS and Windows WSL 2 and it does seem to work

**Step 1:** Locate the sample environment file:  
```bash
tooling/dev/.env.dev.merged.sample
```

**Step 2:** Update entries marked with `xxxxx`. You may need to create accounts and generate API keys for Razorpay and Google Cloud Platform (GCP).

**Step 3:** Rename the sample file:  
```bash
mv tooling/dev/.env.dev.merged.sample tooling/dev/.env.dev.merged
```

**Step 4:** Split the merged file into per-service files:  
```bash
./scripts/envtool dev --split
```

> `envtool` is a CLI that helps manage `.env` files across services. It can **merge** service-specific `.env` files into a single view, **split** them back into per-service files, and generate masked `.env.*.sample` files for sharing. Run it from `./scripts/envtool`

**Step 5:** Start dependency services:  
```bash
./scripts/dev-env start services -d
```
> `dev-env` is a CLI built around Docker Compose to reduce typing when starting services. Additional parameters for Docker and Compose can be passed in nearly all commands. Run `./scripts/dev-env --help` to know more.

**Step 6:** Build and start the app:  
```bash
./scripts/dev-env start app --watch
```

**Step 7:** Run unit tests for the API (via the test-runner container):  
```bash
./scripts/dev-env test api
```

Note: Unit tests are built so that specific sections of the app can be tested individually.

**Step 8** Run utility commands such as eslint as follows:
```bash
./scripts/dev-env run utils -- npx eslint --ext .vue,.js .
```

> #### Why is this approach preferred
>
> 1.  This is the only approach that separates creation of base images for the app, utilities (like ESLint), and unit testing, allowing for distinct optimization. The containers started in this local flow (app, utilities, test-runner) use the minimal `node:current-alpine` base image. This means they are lean, closest to production containers/pods, and **do not require or install development-specific tools like Git, Python, or Docker inside them**, as these are leveraged from your local host system.
> 2.  **You develop on your local system, and the containers are launched only when needed to run the application or services.** This means there's **no waiting time for a container environment to fully start up before you can begin coding**, unlike Dev Containers or Codespaces. Since base images (with `npm install` layers) can be re-used frequently, app and other containers often start fastest.
> 3.  Since `npm install` operations are fewer within the constantly reused base images, the overall development cycle can be very efficient.
>
> #### Why this may not work for everyone
> 
> 1. `npm install <package_name>` will not add and activate new packages inside running containers and containers need to be built fresh

### Dev Containers

**Best for:**

- Local development inside VS Code
- Maintain `.env` files and database data files in local file system
- Systems without global Git, Python or having odd permissions issues
- Fully isolated and customizable setups

**Notes:**

- `.env` files must be created manually (Follow steps 1 - 4 in Local setup above) before first start, only if local setup has not been done

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
5. When restarting stopped Codespaces, it is necessary to run the following command:
    ```bash
    npm run dev
    ```
    > For Dev Containers and for first boot of Codespace, the application is launched automatically
6. In Codespaces workflow, it is necessary to manually update visibility to "Public" and port protocol to "HTTPS" for port 3000
7. Run unit tests for the API (via the test-runner container):  
    ```bash
    ./scripts/dev-env test api
    ```
    > Note that in both codespaces and local dev containers, this will always create an alpine base image for first test run
8. Utilities such as eslint can be run directly as:
    ```
    npx eslint --ext .vue,.js .
    ```
---

## Common Issues

- ###### Database containers fail to start

  Here are the steps to resolve:
  1. Delete `.gitkeep` files in `db/mongodb` and `db/postgres` folders
  2. If you are on WSL, you may need to update compose files to use named volumes instead of mounting folders (This is not required on MacOS or Linux)

- ###### App container fails to start

  - If this is due to a network error
        Restart your system or flush docker containers and images. The following command is useful
    ```bash
    docker system prune -a
    ```
  - If the error is related to failed watch
        It could be due to permissions issue on db folder. Following command fixes the issue
    ```bash
    sudo chmod -R a+rx db
    ```
  - Seems nuxt is stuck after printing log for loading HTTPS settings
        This is a known issue that I do not want to fix because I will migrate everything to Nuxt 4. But the app should still start successfully
- ###### Running dev-env or envtool throws error `/usr/bin/env: 'python3/r': No such file or directory`

  This error does occur on WSL 2, depending on environment setup. Run the scripts as follows:
  `python3 ./scripts/dev-env ...` or
  `python ./scripts/dev-env ...`

- ###### Resulting Dev Container or Codespace has no services running
  
  This usually happens if the existing devcontainer.json files are not used. When using local Dev Container, use "Reopen in Container", not "New Dev Container". When creating Codespace in Github web UI, use "New with options" and do not click on the "+" icon.

  The resulting Dev Container / Codespace is actually usable, but should be treated and used like the local development workflow

- ###### Opening Codespace URL does not show the app

  * If the Codespace connection is done from local system, the URL in VSCode may use localhost, 0.0.0.0 or 127.0.0.1. Make sure that you use urls of the format xxxxxxxx-3000.app.github.dev
  * If the URL does not open from browser VSCode, make sure that for port 3000, the Port Visibility is set to **"Public"** and Port Protocol is set to **"HTTPS"**
---

## Tips for Advanced Users

- `dev-env` supports passthrough of Docker and Compose arguments
- No build artifacts (`.nuxt`, `node_modules`, etc.) are stored on host
- `dev-env` script is great for custom scripting, isolated test containers, and parallel workflows

---
## Additional Notes

- `dev-env` script should not be used to connect to or run commands in other containers if local Dev Containers or Codespaces are used
- The Codespaces workflow seeds data automatically when first creating the Codespace
- I have deliberately not provided ready-made scripts to dump data and seed it, even if I have added the actual seeded data. This is inconvenient for me, but intentional to ensure that updating the included seed data/local database is deliberate and not an accident. However, I have added scripts in ```.devcontainer/github/postCreate.sh``` to restore data from seed data when creating a new Codespace
---
Let me know if anything breaks — especially if you're using a setup other than Raspberry Pi!
