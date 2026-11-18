# Dependencies

This file lists every library, runtime, container image, infrastructure provider and CI action the project uses. It covers each tier.

Versions come from the checked-in manifests (`package.json`, `package-lock.json`, `Dockerfile`, `docker-compose.yml`, `*.tf`, `.github/workflows/*.yml`). "Declared" is the range in `package.json`. "Locked" is the exact version pinned in `package-lock.json`, which is what `npm ci` installs.

## Runtimes and base images

| Component | Version | Used by | Defined in |
|-----------|---------|---------|------------|
| Node.js (`node:22-alpine`) | 22 | API, migrations, web (build and runtime) | `src/api/Dockerfile`, `src/db/Dockerfile`, `src/web/Dockerfile` |
| PostgreSQL (`postgres:17-alpine`) | 17 | Local database | `docker-compose.yml` |
| Cloud SQL PostgreSQL | `POSTGRES_17` | Deployed database | `src/infrastructure/main.tf` |
| Terraform | `>= 1.5` (CI uses `~1.5`) | Infrastructure | `src/infrastructure/main.tf`, `.github/workflows/deploy.yml` |
| Docker + Docker Compose | any recent | Local development | `docker-compose.yml` |

## API (`src/api/`)

An Express REST API backed by PostgreSQL. 81 packages in total, counting transitive ones.

| Package | Declared | Locked | License | Purpose |
|---------|----------|--------|---------|---------|
| [express](https://expressjs.com/) | `^5.2.1` | 5.2.1 | MIT | HTTP server and routing (`index.js`) |
| [pg](https://node-postgres.com/) | `^8.21.0` | 8.21.0 | MIT | PostgreSQL client and connection pool (`db.js`) |

There are no dev dependencies. `npm run dev` uses Node's built-in `--watch` flag.

## Database migrations (`src/db/`)

Runs schema migrations against PostgreSQL. Locally this is the Compose `migrate` service. In GCP it is the Cloud Run Job. 49 packages in total, counting transitive ones.

| Package | Declared | Locked | License | Purpose |
|---------|----------|--------|---------|---------|
| [node-pg-migrate](https://salsita.github.io/node-pg-migrate/) | `^8.0.4` | 8.0.4 | MIT | Migration runner (`npm run migrate`, `npm run migrate:down`) |
| [pg](https://node-postgres.com/) | `^8.21.0` | 8.21.0 | MIT | PostgreSQL driver used by node-pg-migrate |

## Web frontend (`src/web/`)

A Next.js App Router frontend built with `output: "standalone"`. 434 packages in total, counting transitive ones.

### Runtime dependencies

| Package | Declared | Locked | License | Purpose |
|---------|----------|--------|---------|---------|
| [next](https://nextjs.org/) | `16.2.9` | 16.2.9 | MIT | Framework: routing, server actions, build, `next/font` |
| [react](https://react.dev/) | `19.2.4` | 19.2.4 | MIT | UI library |
| [react-dom](https://react.dev/) | `19.2.4` | 19.2.4 | MIT | React DOM renderer |

### Development dependencies

| Package | Declared | Locked | License | Purpose |
|---------|----------|--------|---------|---------|
| [tailwindcss](https://tailwindcss.com/) | `^4` | 4.3.1 | MIT | Utility-first CSS framework |
| [@tailwindcss/postcss](https://tailwindcss.com/docs/installation/using-postcss) | `^4` | 4.3.1 | MIT | PostCSS plugin for Tailwind (`postcss.config.mjs`) |
| [typescript](https://www.typescriptlang.org/) | `^5` | 5.9.3 | Apache-2.0 | Type checking (`tsconfig.json`) |
| [@types/node](https://www.npmjs.com/package/@types/node) | `^20` | 20.19.43 | MIT | Node.js type definitions |
| [@types/react](https://www.npmjs.com/package/@types/react) | `^19` | 19.2.17 | MIT | React type definitions |
| [@types/react-dom](https://www.npmjs.com/package/@types/react-dom) | `^19` | 19.2.3 | MIT | React DOM type definitions |
| [eslint](https://eslint.org/) | `^9` | 9.39.4 | MIT | Linting (`npm run lint`) |
| [eslint-config-next](https://nextjs.org/docs/app/api-reference/config/eslint) | `16.2.9` | 16.2.9 | MIT | Next.js ESLint rules (`core-web-vitals`, `typescript`) |

### Fonts

- [Geist and Geist Mono](https://vercel.com/font) are loaded through `next/font/google` in `app/layout.tsx`. They are downloaded at build time.

## Infrastructure (`src/infrastructure/`)

### Terraform providers

| Provider | Version | Purpose |
|----------|---------|---------|
| [hashicorp/google](https://registry.terraform.io/providers/hashicorp/google/latest) | `~> 5.0` | All GCP resources |
| [hashicorp/random](https://registry.terraform.io/providers/hashicorp/random/latest) | `~> 3.0` | Generates the database password (`random_password`) |

Terraform state is stored in the `gcs` backend. CI supplies the bucket and prefix at `terraform init` time.

### Google Cloud services

| Service | Terraform resources |
|---------|---------------------|
| Compute Engine networking (VPC) | `google_compute_network`, `google_compute_subnetwork`, `google_compute_global_address` |
| Service Networking (private services access) | `google_service_networking_connection` |
| Serverless VPC Access | `google_vpc_access_connector` |
| Cloud SQL for PostgreSQL | `google_sql_database_instance`, `google_sql_database`, `google_sql_user` |
| Secret Manager | `google_secret_manager_secret`, `google_secret_manager_secret_version`, `google_secret_manager_secret_iam_member` |
| Cloud Run (services and jobs) | `google_cloud_run_v2_service`, `google_cloud_run_v2_service_iam_member`, `google_cloud_run_v2_job` |
| IAM | `google_service_account`, `google_project_iam_member` |
| Container Registry (`gcr.io`) | Image hosting, used by CI |

## CI/CD (`.github/workflows/deploy.yml`)

| Action | Version | Purpose |
|--------|---------|---------|
| [actions/checkout](https://github.com/actions/checkout) | `v4` | Check out the repository |
| [google-github-actions/auth](https://github.com/google-github-actions/auth) | `v2` | Workload Identity Federation auth to GCP |
| [docker/setup-buildx-action](https://github.com/docker/setup-buildx-action) | `v3` | Set up Docker Buildx |
| [docker/build-push-action](https://github.com/docker/build-push-action) | `v6` | Build and push the API, web and migration images |
| [hashicorp/setup-terraform](https://github.com/hashicorp/setup-terraform) | `v3` | Install Terraform |

The workflow also uses the `gcloud` CLI, which comes preinstalled on `ubuntu-latest` runners. It uses `gcloud` to configure Docker auth and to run the migration job.

## Keeping this file up to date

When you add, remove or upgrade a dependency, update the matching table above. To list the locked top-level versions for a package:

```bash
cd src/web   # or src/api, src/db
npm ls --depth=0
```
