# Note Keeper - AI Powered Note Taking App

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Pinecone](https://img.shields.io/badge/Pinecone-007FFF?style=for-the-badge&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-4285F4?style=for-the-badge&logoColor=white)
![Markdown Support](https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white)

## Overview

**Note Keeper** is a modern and intuitive note-taking application that leverages the power of Artificial Intelligence to enhance your note-taking experience. Built with a focus on simplicity and functionality, it allows you to effortlessly create, organize, and access your notes. Key features include:

## Features

* **Markdown Support:** Write and format your notes with ease using familiar Markdown syntax.
* **Image Integration:** Embed images directly into your notes to add visual context.
* **AI-Powered Chatbot:** Ask questions about your notes and receive intelligent answers powered by a simple Retrieval-Augmented Generation (RAG) implementation.
* **Seamless Organization:** Keep your thoughts organized with a clean and user-friendly interface.

## Tech Stack

* **Frontend:** [Next.js](https://nextjs.org/)
* **Backend & Database:** [Supabase](https://supabase.com/)
* **Vector Database:** [Pinecone](https://www.pinecone.io/)
* **Large Language Model:** [Google Gemini](https://ai.google.dev/)

## Getting Started

To run Note Keeper locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/iSubhamMani/note-keeper.git
    cd note-keeper
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add the following environment variables. You will need to obtain these credentials from the respective services:

    ```env
    NEXT_PUBLIC_SUPABASE_URL = ""
    NEXT_PUBLIC_SUPABASE_KEY = ""
    GOOGLE_CLIENT_ID = ""
    GOOGLE_CLIENT_SECRET=""
    NEXT_AUTH_SECRET = ""
    PINECONE_KEY = ""
    GOOGLE_AI_KEY = ""
    PINECONE_INDEX = ""
    CLOUDINARY_API_KEY = ""
    CLOUDINARY_SECRET = ""
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = ""
    ```

4.  **Initialize Supabase and Pinecone:**
    * Set up your Supabase project and create the necessary database tables (e.g., for notes and users).
    * Create a Pinecone index to store the embeddings of your notes.

5.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

    Open your browser and navigate to `http://localhost:3000`.
