Web Api Server for the Ecology Department of [REDACTED] to digitize
their environment impact and assessment process existing on excel.

- Server exposes endpoints for client-side (React) application to consume. 
- Persist JSON data in MYSQL using Sequelize (a promise-based Node.js ORM)

Brief source code structure:
- Services folder - Interface with corresponding tables in database e.g. Querying, analysis etc.
- Models folder - Map to tables in database
- Routes folder - endpoints
- Docker file for containerizing and deploying server to Azure

