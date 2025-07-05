# Docker Compose Stack: Full-Stack App

This project is a full-stack web application using Docker Compose.  
It includes a React frontend (served by nginx), an Express backend (with Prisma ORM), and a PostgreSQL database.

---

## Features

- **Frontend:** React (Vite) served via nginx
- **Backend:** Express.js with Prisma ORM
- **Database:** PostgreSQL
- **Containerized:** All services run in Docker containers
- **Environment Variables:** Credentials managed via `.env` file

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd dock-compose-stack
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_db
DATABASE_URL=postgresql://your_user:your_password@postgres:5432/your_db
```

> **Note:**  
> If your password contains special characters, [URL-encode](https://www.urlencoder.org/) them in `DATABASE_URL`.

### 3. Build and start the stack

```bash
docker-compose up --build
```

- Frontend: [http://localhost:3001](http://localhost:3001)
- Backend API: [http://localhost:3000/api](http://localhost:3000/api)
- PostgreSQL: port 5432 (internal use)

### 4. Database migrations

After changing your Prisma schema, run:

```bash
docker-compose exec backend npx prisma migrate deploy
```

---

## Project Structure

```
.
├── backend/      # Express API + Prisma
├── frontend/     # React app (Vite)
├── docker-compose.yml
├── .env
└── README.md
```

---

## Useful Commands

- **View logs:**  
  `docker-compose logs -f`

- **Stop all containers:**  
  `docker-compose down`

- **Remove all containers and volumes (erases DB):**  
  `docker-compose down -v`

---

## Troubleshooting

- If you change database credentials or name, run:
  ```bash
  docker-compose down -v
  docker-compose up --build
  ```

- If you get a "Bad Gateway" or frontend is not available, check:
  - The frontend build process and Dockerfile
  - That the frontend is mapped to port 80 inside the container

---

## Next Steps

- Implement authentication (JWT, OAuth, etc.)
- Add tests (Jest)
- Set up CI (GitHub Actions)

---

## License

[MIT](./LICENSE)