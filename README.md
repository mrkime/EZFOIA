# EZFOIA

EZFOIA is a platform that makes filing Freedom of Information Act (FOIA) requests as simple as buying something online. Users provide minimal information through an interactive guided experience, and EZFOIA generates an optimized FOIA request using AI. Requests are submitted to the relevant agencies, and users can track their status, receive notifications, and search through returned documents.

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Features](#features)  
3. [Getting Started](#getting-started)  
   - [Use Lovable](#use-lovable)  
   - [Local Development](#local-development)  
   - [Editing Files Directly on GitHub](#editing-files-directly-on-github)  
   - [GitHub Codespaces](#github-codespaces)  
4. [Tech Stack](#tech-stack)  
5. [Project Structure](#project-structure)  
6. [Deployment](#deployment)  
7. [Contributing](#contributing)  
8. [License](#license)  

---

## Project Overview

EZFOIA simplifies the public records request process. Its core philosophy is:

- **Guided Intake:** Step-by-step interactive input that collects only the information the user knows.  
- **AI Drafting:** Automatically generates a legally optimized FOIA request for the user to review.  
- **Editable Request Preview:** Users can review and modify the request before submission.  
- **Tracking & Notifications:** Users can monitor their request status and receive updates.  
- **Subscription Options:** Single request payment or subscription plans for frequent users.  

Website / Project URL: [https://ezfoia.com](https://ezfoia.com)

---

## Features

- **Interactive FOIA Intake:** Converts user-provided plain English information into a structured FOIA request.  
- **AI-Powered Request Drafting:** Generates agency-appropriate, compliant, and professional FOIA requests.  
- **Editable Preview:** Allows users to make edits while maintaining legal compliance.  
- **Request Tracking Dashboard:** Provides status updates and notifications for submitted requests.  
- **Multiple Payment Options:** Single request payment or subscription plans.  
- **Document Search & Analysis:** AI-assisted search of returned documents.  

---

## Getting Started


### Local Development

To work locally using your own IDE:

#### Prerequisites

- Node.js & npm installed (recommended via [nvm](https://github.com/nvm/nvm#installing-and-updating))

#### Setup

```bash
# Step 1: Clone the repository
git clone https://github.com/mrkime/ezfoia.git

# Step 2: Navigate to the project folder
cd ezfoia

# Step 3: Install dependencies
npm install

# Step 4: Start development server with hot reloading
npm run dev
```

## Editing Files Directly on GitHub

1. Navigate to the file you want to edit.  
2. Click the **Edit (pencil)** icon in the top right.  
3. Make your changes and commit them directly to the repository.  

---

## GitHub Codespaces

1. Navigate to your repository main page.  
2. Click the green **Code** button → **Codespaces** tab → **New codespace**.  
3. Edit files in the Codespace and commit your changes.  

---

## Tech Stack

- **Frontend:** React + TypeScript  
- **Styling:** Tailwind CSS + shadcn-ui  
- **Build Tool:** Vite  
- **AI Integration:** Custom AI module for FOIA drafting  
- **State Management:** React Context / Redux (depending on module)  
- **Deployment:** Hosted through Lovable  

---

## Project Structure

ezfoia/
├─ src/
│ ├─ components/ # Reusable UI components
│ ├─ features/ # FOIA intake, AI drafting, dashboard
│ ├─ pages/ # Page-level React components
│ ├─ hooks/ # Custom React hooks
│ ├─ utils/ # Helper functions and API clients
│ └─ styles/ # Tailwind and shadcn-ui configuration
├─ public/ # Static assets
├─ package.json # Project dependencies
├─ tsconfig.json # TypeScript configuration
└─ vite.config.ts # Vite configuration


---

---

## Contributing

We welcome contributions!

1. Fork the repository.  
2. Create a new branch for your feature:  
3. Make your changes and commit:
```bash
git commit -m "Add new feature"
```

Push the branch and open a Pull Request.

Please follow standard GitHub contribution guidelines and include descriptive commit messages.

License

EZFOIA is released under the MIT License. See LICENSE
 for details.
