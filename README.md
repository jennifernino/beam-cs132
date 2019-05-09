# BEAM Lesson Planner Application
## Contributors
  Jennifer Nino Tapia,
  Delmy Garcia,
  Rohit Chaparala
## General
### Problem
BEAM is an organization that leads after school lessons to students in public elementary schools. Their current system is very inefficient, as the student volunteers who create the lessons simply create the lessons in a Google Doc and add it to the team drive. Whenever student volunteers need inspiration or would like to see past lessons, they typically have to look at the docs available or ask the team leader for them. Because there is no consistent lesson format, searching for these lessons becomes very time consuming and as of result, there is a lot of time lost managing the different lessons.
### Solution
Create a web application that volunteers can sign into and query different lessons. This application also allows leaders to manage volunteers who’ve signed up.
### Tech Stack
- Languages
..- JavaScript
- FrameWorks
..- React.js
..- Node.js
- Databases
..- MongoDB

## Installation
To install our project:
1. move into a directory you would like keep the final project files (IE)
```
mkdir cs132-final
cd cs132-final
```
2. Clone the project to your computer using the link provided at the clone button
```
git clone https://github.com/[username]/beam-cs132.git`
```
3. Move into the project directory (it contains the client folder, `schemas.js`, `server.js`, `token.js`, etc...) and run the command below to install the dependencies
```
npm install
```
4. Next move into the client directory and run the same command to install the dependencies for the client.
```
cd client
npm install
```
5. Go back to the main project directory and to run the applciation, open two different terminals (or put the first process in the background, and run the server first). This should be run from the directory that has the client folder, `schemas.js`, `server.js`, `token.js`, etc...
```
cd ..
node server.js
```
OR (to run in the background)
```
node server.js &
```
6. In the client folder to run the client
```
cd client
npm start
```
7. In a web browser, if you go to <http://localhost:3000> that should open up the project. Note this may take a minute or two.\\

**Note:** If the server is working and connected, the following message should appear in the terminal you are running the server:
>App is listening on port 8080

>SUCCESS: Connected to mongodb+srv://[DATABASE]:[CREDENTIALS]@cluster0-auldt.mongodb.net/[DATABASE]

## Customize
There are a few things that you need to do to full make this application your own.
### The Database
In order to use the application, you need have access to a MongoDB database. This will be where you store your users and lesson plans you create with your application. When you set up your connection, you should replace the first few lines in under the *Database set up functionality* section in `server.js` (roughly starting at line 134). There you will set up the connection to your database using the credentials provided by them. When you create your cluster with Mongo, there should be a *connect* option with them, you should be able to get the **url** necessary by clicking on *connect application* with Driver Node.js and Version 3.0 or later.\\
You should also have 2 collections in that cluster, `users` and `lessons`. The schemas of these collections can be found in the `schemas.js` file. \\

### OAuth2
Because our application sends emails to users who've forgotten their password, it is necessary to set up OAuth2 to have the ability to send emails. Go to [Gmail API]:https://developers.google.com/gmail/api/quickstart/nodejs?authuser=5 site and complete step 1. Download the client configuration and replace the `credentials.json` file with the one you download. If possible, also rename it (if it is not already) `credentials.json`. That way, you don't have to change anything else (hopefully) in the `server.js` file. Next, to fully install it, follow the instructions given in the terminal. This portion may require you to run the server in the foreground instead as a background job (*with the &*).

### Setting up a first user
Before you can actually start interacting with the application, there needs to be some admin defined and verified. So, when the application is running, go ahead and  create a user as normal. Next, login into your Mongodb account and manually give permissions to the user. Set the fields, `isAdmin` to 1 and `verified` to 1. Now, this user is both an admin and verified. They should be able to log in and manage any new users (ie accept their request to join BEAM) so having to manually change it in the database should no longer be necessary.
## Styles
All style is located in the `style` folder located in `client/src/components/style`
## Project Information
This project was created as a part of the course Web Applications ([CSCI 1320]: https://cs.brown.edu/courses/csci1320)
