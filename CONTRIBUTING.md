# Contributing Guidelines

Thanks for checking out this project!

This is a solo developer project built for learning, reference, and experimentation.  
You’re welcome to:

- Clone it  
- Fork it  
- Use it as a foundation for your own work

---

## Getting started

> Note that I have used a Raspberry Pi for the entire development. The `./scripts/dev-env` script should abstract away this quirk, but let me know if it doesn't 

* Step 1: Locate the `tooling/dev/.env.dev.merged.sample`
* Step 2: Update entries with xxxxx. You may need to create Razorpay, GCP accounts and keys
* Step 3: Rename `tooling/dev/.env.dev.merged.sample` to `tooling/dev/.env.dev.merged`

> `envtool` is a lightweight utility script that helps manage `.env` files across services. It can **merge** service-specific `.env` files into a single view, **split** them back into per-service files, and generate masked `.env.*.sample` files for sharing. Run it from `./scripts/envtool`.

* Step 4: Run `./scripts/envtool dev --split`
* Step 5: Verify contents in `tooling/dev/targets.json`

> `dev-env` is a cli built around docker compose to reduce typing when starting services. Additional parameters for docker and compose can be passed in nearly all the commands. Run `./scripts/dev-env --help` to know more

* Step 6: Start the dependency services with the command below
```bash
./scripts/dev-env start services -d
```
* Step 7: Build and start the app with the command below
```bash
./scripts/dev-env start app -d
```
* Step 8: Unit testing can be done using the command below (for test-runner container). Note that unit tests are built so that specific sections of the app can be tested individually
```bash
./scripts/dev-env test api
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
