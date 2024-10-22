# Driver Console Client Application

This project is a **React Native-based Driver Console Application** for managing bus driver operations. The application is built using **Expo** and integrates with backend microservices to provide features like route planning, live location tracking, and WebSocket-based communication with passengers.

The frontend interacts with multiple backend microservices that need to be set up and running before the client can be fully functional. This README provides steps to configure and run the frontend along with the necessary backend services.

---

## Project Summary

This mobile application assists bus drivers in navigation and managing ride requests. The backend microservices focus on:

- **Auth Service**: Managing user authentication for bus drivers and administrators.
- **OrderBus Service**: Handling communication between passengers and bus drivers via WebSockets.

---

## Prerequisites

Before running the project, ensure you have the following tools installed:

1. [Node.js](https://nodejs.org/en/) (version 16.x or higher)
2. [Expo CLI](https://docs.expo.dev/get-started/installation/) for building and running the application.
3. [Docker](https://docs.docker.com/get-docker/) (optional, for running the backend services in containers).

You will also need to clone the backend services from the repository:

```bash
git clone https://github.com/ShovalShabi/smartBUS_Microservices.git
```

Follow the instructions in the backend's README to set up and run the microservices.

---

## Running the Application via Expo

### Step 1: Clone the Frontend Project

Clone the frontend repository to your local machine:

```bash
git clone https://github.com/ShovalShabi/Driver_Console_Client.git
cd Driver_Console_Client
```

### Step 2: Install Dependencies

Install all necessary dependencies using the following command:

```bash
npm install
```

### Step 3: Running the Development Server

To run the project in development mode, use one of the following commands depending on your platform:

- For all platforms:

```bash
npm run start
```

- For Android:

```bash
npm run android
```

- For iOS:

```bash
npm run ios
```

- For Web:

```bash
npm run web
```

- For Tunnel:

```bash
npm run tunnel
```

### Step 4: Running with a Clean Cache

To run the application while cleaning the cache (useful for debugging):

```bash
npm run start_clean_cache
```

---

## Backend Setup

You need to run the backend services before launching the frontend application. Make sure you have the backend repository set up and services like **Auth** and **OrderBus** running. These services are essential for the application to work properly.

To run the backend services via Docker, use the provided `docker-compose.yaml` in the backend repository:

```bash
docker-compose up --build -d
```

Make sure the backend services are running on the following ports:

- **Auth Service**: `http://localhost:3804`
- **OrderBus Service**: `http://localhost:6936`

---

## Environment Variables

You will need environment variables to connect the frontend to the backend services. For the `.env` file, contact the project maintainers to request the necessary keys:

- Send an email to:
  - [shovalshabi@gmail.com](mailto:shovalshabi@gmail.com?subject=Requesting%20.env%20files%20for%20driver_console_client)
  - [tamir303@gmail.com](mailto:tamir303@gmail.com?subject=Requesting%20.env%20files%20for%20driver_console_client)

---

## Running Tests

To run tests locally, use the following command:

```bash
npm run test
```

This will execute the test suite using the configured test runner for Expo.

---

## Docker Setup for Frontend

If you want to run the frontend in a Docker container, follow these steps:

```bash
docker-compose up --build -d
```

Make sure the backend services are running before starting the frontend in Docker mode.

---

## Contact

If you encounter any issues or have questions about the project, feel free to reach out via email to:

- [shovalshabi@gmail.com](mailto:shovalshabi@gmail.com?subject=Requesting%20Support%20for%20driver_console_client)
- [tamir303@gmail.com](mailto:shovalshabi@gmail.com?subject=Requesting%20Support%20for%20driver_console_client)

#### © All rights reserved to Shoval Shabi and Tamir Spilberg
