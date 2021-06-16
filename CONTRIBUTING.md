# Contributing

Contributions are always welcome! Here is some documentation to show you how to do it!

### Workflow

#### Step 1: Find an issue

Step 1 is to find an issue that you can do. check the [issues](https://github.com/Uklizdev/Chat-App/issues) page or just raise your own with a new idea.

#### Step 2: Create a fork or branch.

All work should be done on a fork. Make sure to [keep your fork up to date](https://dev.to/giannellitech/keeping-your-fork-up-to-date-klh).

#### Step 3: Making changes

Make necessary changes then commit.

### Step 4: Make sure to write good documentation

Make sure you explain your changes very well, information such as linking the issue (#issueNumber) and screenshots is highly appreciated.

### Step 5: Pull Request

Open a pull request into the Chat App "Contributions" branch. Someone will review your project as soon as possible.

## Documentation

### Setting up the backend

Create an App in Firebase .

### Clone repository

```bash
git clone https://github.com/Uklizdev/Chat-App
```

Or with GitHub CLI

```bash
gh repo clone Uklizdev/Chat-App
```

### Installing dependencies

Make sure you are in the correct folder and run.

```bash
npm install
```

### Connecting Firebase with the app

You'll need to create a .env file with all your Firebase credentials in:

Go to your Firebase project configuration, you'll find something like this:

```
// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "YOUR API KEY",
    authDomain: "YOUR AUTH DOMAIN",
    databaseURL: "YOUR DATABASE URL",
    projectId: "YOUR PROJECT ID",
    storageBucket: "YOUR STORAGE BUCKET",
    messagingSenderId: "MESSAGING ID",
    appId: "YOUR APPID"
  };
```

copy each of this lines in the .env file, it should look something like this:

```
//in .env.local file
REACT_APP_FIREBASE_API_KEY= YOUR API KEY
REACT_APP_FIREBASE_AUTH_DOMAIN= YOUR AUTH DOMAIN
REACT_APP_FIREBASE_DB_URL= YOUR DATABASE URL
REACT_APP_FIREBASE_PROJECT_ID= YOUR PROJECT ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR STORAGE BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID= MESSAGING ID
REACT_APP_FIREBASE_APP_ID= YOUR APPID
```

### Running Chat App locally

Make sure you are in the client folder and run

```
npm start
```

### Problems?

If you experience a bug or issues you could not fix, do not hesitate to open a new [GitHub issue](https://github.com/Uklizdev/Chat-App/issues).
