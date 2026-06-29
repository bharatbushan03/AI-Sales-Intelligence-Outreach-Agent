# Vercel Free Tier Deployment Guide

This document outlines the process for deploying the Autonomous B2B Sales Intelligence Agent using Vercel's free tier and Firebase's Spark Plan.

## Architecture

*   **Frontend & Serverless Functions:** Vercel (Free Tier)
*   **Database:** Firebase Firestore (Spark Plan)
*   **Authentication:** Firebase Authentication (Spark Plan)
*   **Storage:** Firebase Storage (Spark Plan)
*   **AI Engine:** Google Gemini API

## Prerequisites

1.  A GitHub account with access to the repository.
2.  A Vercel account (linked to your GitHub).
3.  A Firebase project configured for the web.
4.  A Gemini API Key.

## Step 1: Firebase Configuration (Spark Plan)

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project or select your existing project.
3.  Ensure your billing plan is set to **Spark (Free)**.
4.  Enable **Firestore Database**, **Authentication** (Google Sign-In), and **Storage**.
5.  Go to **Project Settings > Service accounts** and generate a new private key. You will need the `project_id`, `client_email`, and `private_key` for Vercel.

## Step 2: Vercel Deployment

1.  Log in to [Vercel](https://vercel.com/) and click **Add New... > Project**.
2.  Import your GitHub repository.
3.  Vercel will automatically detect the **Next.js** framework and configure the build settings (`npm run build` and `npm run dev`).
4.  **Environment Variables:** Add the following environment variables in the Vercel dashboard:
    *   `GEMINI_API_KEY`: Your Google Gemini API Key.
    *   `FIREBASE_PROJECT_ID`: Your Firebase Project ID.
    *   `FIREBASE_CLIENT_EMAIL`: Your Firebase Client Email.
    *   `FIREBASE_PRIVATE_KEY`: Your Firebase Private Key (ensure newlines are properly escaped or pasted exactly as is).
    *   `NEXT_PUBLIC_FIREBASE_API_KEY`: Client-side API key.
    *   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Client-side Auth domain.
    *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Client-side Project ID.
5.  Click **Deploy**. Vercel will build and deploy your application.

## CI/CD Pipeline

This repository is configured with a GitHub Actions workflow (`.github/workflows/ci.yml`) that automatically runs:
*   Linting (`npm run lint`)
*   Type Checking (`npm run typecheck`)
*   Tests (`npm run test`)
*   Build (`npm run build`)
*   Vercel Deployment Preview (on PRs) and Production (on main).

To use the GitHub Actions Vercel deployment, you must add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` to your GitHub Repository Secrets.

## Troubleshooting

*   **Serverless Function Timeouts:** Vercel's free tier has a 10-second execution limit for Serverless Functions. Ensure that any long-running API routes (such as Gemini generations) respond quickly, stream data, or use background jobs if necessary.
*   **Firebase Connection Errors:** Ensure the `FIREBASE_PRIVATE_KEY` is formatted correctly in Vercel's environment variables. It must include the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` tags with proper newline breaks.
