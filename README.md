# Pet Adoption Portal

A Vue 3 application for displaying and managing pets available for adoption.

## Project Overview

This pet adoption portal allows users to:
- View a list of pets available for adoption
- View detailed information about individual pets
- Mark pets as adopted
- Add new pets to the database

## Setup Process

### Initial Project Setup

1. Created a Vue 3 project with Vite:
   ```
   npm create vite@latest petAdoptionPortal -- --template vue
   ```

### Installing Dependencies

2. Installed Firebase for database functionality:
   ```
   npm install firebase
   ```

3. Installed Vue Router for navigation between pages:
   ```
   npm install vue-router@4
   ```

4. Installed Sass for SCSS support:
   ```
   npm install -D sass
   ```

5. Installed Firebase CLI for deployment and tooling:
   ```
   sudo npm install -g firebase-tools
   ```

### Firebase Configuration

6. Created `src/firebase.js` with configuration setup:
   ```javascript
   import { initializeApp } from "firebase/app";
   import { getFirestore } from "firebase/firestore";

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };

   const app = initializeApp(firebaseConfig);
   const db = getFirestore(app);

   export { db };
   ```

## Styling with SCSS

The project uses SCSS for styling:

1. Added `lang="scss"` attribute to style tags in Vue components
2. Created a variables file at `src/assets/styles/variables.scss` with:
   - Color variables
   - Spacing variables
   - Typography variables

## Firestore Structure

The app uses a Firestore database with the following structure:

### Collection: `pets`

Each document contains:
- `id`: string (Firestore document ID)
- `name`: string (pet's name)
- `type`: string (e.g., dog, cat, rabbit)
- `age`: number (pet's age in years)
- `description`: string (description of the pet)
- `adopted`: boolean (whether the pet has been adopted)
- `createdAt`: timestamp (when the pet was added to the database)

## Application Routes

The application includes the following routes:

| Route | View Name | Description |
|-------|-----------|-------------|
| / | HomeView | Welcome screen with intro and links |
| /pets | PetListView | View a list of all adoptable pets |
| /add | AddPetView | Add a new pet to the database |
| /pets/:id | PetDetailView | View detailed info about a single pet |

## Running the Project

Before running the project, make sure to set up a Firebase project and update the configuration in `src/firebase.js`.

```
# Install dependencies
npm install

# Start development server
npm run dev
```

## Firebase Setup

To set up Firebase for this project:

1. Create a new Firebase project at https://console.firebase.google.com/
2. Enable Firestore database
3. Register a web app in your Firebase project
4. Copy the Firebase configuration to `src/firebase.js`
5. (Optional) For deployment, use Firebase CLI:
   ```
   firebase login
   firebase init
   firebase deploy
   ```

## Automated Deployment with GitHub Actions

This project is set up for automated deployment to Firebase Hosting using GitHub Actions.

### Setup:

1. Push your code to a GitHub repository
2. Generate a Firebase Service Account token:
   ```
   firebase login:ci
   ```
3. Add the token as a GitHub repository secret named `FIREBASE_SERVICE_ACCOUNT_PETADOPTIONPORTAL`
4. Push changes to the main/master branch to trigger automatic deployment

The GitHub Action workflow:
- Builds the project with npm
- Deploys to Firebase Hosting
- Updates Firestore rules and indexes

Current deployment: https://petadoptionportal.web.app
