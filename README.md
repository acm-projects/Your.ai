
<p align="center">
<img src='https://media.tenor.com/OQBiUWl9AG4AAAAM/i-robot-no.gif' width='700'>
</p>

<h1 align="center">🤖Your.ai🤖</h1>

<p align="center">
Managing schedules and finding time for yourself can be difficult as a university student. Thankfully, Your.ai has got your back! Led by an LLM powered AI assistant, this web app will be able to connect to your calendar where all you need to do is speak or text the AI assistant how you want to tune your schedule, personal action items, and deadlines. Additionally, the web app can provide task management and organization in-house to make managing your schedule that much easier. Need to find time for the gym? Gotta do a grocery run this week? Finals to prep for? Your.ai can search your calendar and task list then reply to you with the best time management solutions just as if you were talking to your own personal assistant!
</p>

## MVP ✅
* User auth → account / profile
  * Google OAuth integration, set scopes to access/modify Google Calendar
* Speak or text a natural language prompt regarding your calendar or task list (find the earliest time for x, how can I adjust for y, add z to my schedule)
  * Speech is processed into text and used as prompting for the LLM powered AI assistant, responds with atomic actions the server can take on the calendar using the Google Calendar API
  * AI assistant replies to the user with both voice and text
* Push notifications that can be set by the AI assistant to remind the user of upcoming events or tasks due
  * Push notifications from the browser and/or email notifications
* Create KanBan boards / to-do lists from given tasks, or prompt with some project description
* Week-at-a-glance
  * Summary of weekly schedule and possible time management suggestions

## Tech Stack & Resources 💻
#### MongoDB, Flask / Express.js, React

<details>
  
**<summary>Comprehensive Full-Stack Tutorials</summary>**

* [Dave Gray: MERN Stack Tutorial Playlist](https://www.youtube.com/playlist?list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V)
* [NetNinja: MERN Stack Crash Course Tutorial Playlist](https://www.youtube.com/playlist?list=PL4cUxeGkcC9iJ_KkrkBZWZRHVwnzLIoUE)
  
</details>

<details>
  
**<summary>Front-end</summary>**

* [Official React Documentation / Setup](https://react.dev/learn/start-a-new-react-project)
* [React Tutorial for Beginners](https://youtu.be/SqcY0GlETPk?si=7m4sb_bs-ksPQLkv)
* [JS Mastery React JS Full Course 2023, 1 hour](https://www.youtube.com/watch?v=b9eMGE7QtTk&ab_channel=JavaScriptMastery)
* [Web Notifications API for React](https://www.youtube.com/watch?v=mFRPpINFMz0)
* [Official TailwindCSS Documentation / Setup](https://tailwindcss.com/docs/installation)
* [Official Bootstrap Documentation / Setup for JavaScript](https://getbootstrap.com/docs/5.3/getting-started/javascript/)

</details>

<details>
  
**<summary>Back-end</summary>**

* Flask back-end server
  * [OAuth-based Authentication in Flask](https://syscrews.medium.com/oauth-based-authentication-in-flask-3569746002ba)
  * [Flask + OpenAI GPT](https://medium.com/@abed63/flask-application-with-openai-chatgpt-integration-tutorial-958588ac6bdf)
  * [Python Package guide](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/) 
* Alternative to Flask - Node.js server using Express.js
  * [Official Express.js Documentation / Setup](https://expressjs.com/en/starter/installing.html)
  * [Dave Gray Intro to Express.js](https://www.youtube.com/watch?v=jivyItmsu18&ab_channel=DaveGray)
  * [Learn Express.js in 35 Minutes](https://www.youtube.com/watch?v=SccSCuHhOw0&ab_channel=WebDevSimplified)
  * [Official Mongoose Documentation (Express.js library for connecting to MongoDB database)](https://mongoosejs.com/docs/)
</details>

<details>
  
**<summary>Third-party Integrations / APIs</summary>**

  * [OpenAI API Platform | Developer Quickstart](https://platform.openai.com/docs/quickstart)
  * [OpenAI API Platform | Assistants API Overview](https://platform.openai.com/docs/assistants/overview)
  * [RAG w/ LangChain Tutorial](https://python.langchain.com/docs/tutorials/rag/)
  * [What is RAG?](https://aws.amazon.com/what-is/retrieval-augmented-generation/)
  * [Google Calendar API official Documentation](https://developers.google.com/calendar)

</details>

<details>
  
**<summary>Dev Tools/Software</summary>**

* [Git](https://git-scm.com/downloads)
* [VS Code](https://code.visualstudio.com/download)
* [Node.js](https://nodejs.org/en/download/package-manager)
* [MongoDB Compass](https://www.mongodb.com/docs/compass/current/install/)
* [Postman](https://www.postman.com/downloads/)

</details>


## Milestones 📅

<table>
  <tr>
    <th>Week</th>
    <th>Overall</th>
    <th>Frontend Tasks</th>
    <th>Backend Tasks</th>
  </tr>
  <tr>
    <td>Week 1</td>
    <td>
       <ul>
        <li>Get to know everyone :)</li>
        <li>Begin UI/UX design</li>
        <li>Set up development environments for both front-end (React) and back-end (Express.js / Flask, MongoDB)</li>
      </ul>
    </td>
    <td><ul><li>Set up development environments for front-end</li></ul></td>
    <td><ul><li>Set up development environments for back-end</li></ul></td>
  </tr>
  <tr>
    <td>Week 2/3</td>
    <td>
       <ul>
        <li>Get familiar with tech stack</li>
        <li>Begin starting with basic deliverables</li>
       <li>Brainstorm schemas for the database (Both front-end and back-end should be in agreement before creating states/models)</li>
        <ul>
      </ul>
    </td>
    <td>
      <ul>
        <li>Finalize UI/UX design concepts (Finish by end of Week 3)</li>
        <li>Implement designs for Login/Register page and set-up homepage (will be finished in a later week)</li>
      </ul>  
    </td>
    <td>
      <ul>
        <li>Spin up MongoDB Atlas cluster, give everyone access and download Compass</li>
        <li>Organize backend server and set up auth to authenticate through Google’s OAuth 2.0 (can import some package to handle working with OAuth or go full-send w/ Auth0)</li>
        <li>Set up Google Calendar API</li>
      </ul>  
    </td>
  </tr>
  <tr>
    <td>Week 4/5</td>
    <td>
       <ul>
      </ul>
    </td>
    <td>
      <ul>
        <li>Set up routing for pages and set up context components to handle the OAuth token</li>
        <li>Implement speech-to-text audio processing for the React application</li>
        <li>Create pages and components for KanBan board</li>
      </ul> 
    </td>
    <td>
      <ul>
        <li>Begin writing prompting for GPT (or other LLM) to understand user input as requests for specific Google Calendar API endpoints</li>
        <li>Adjust prompting to allow GPT (or other LLM) to read and update user calendar data through requests to the Google Calendar API</li>
      </ul>   
    </td>
  </tr>
   <tr>
    <td>Week 6/7</td>
    <td>
       <ul>
        <li>Continue the great work!</li>
        <li>If there’s still time and space, choose a stretch goal to start developing</li>
        <li>Begin brainstorming ideas for presentation night (be funny and have fun lol)</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>Finish pages and components for KanBan board</li>
        <li>Implement notifications for the browser to read deadlines from the server and send notifications as needed</li>
        <li>If needed, begin helping with back-end backlog</li>
      </ul> 
    </td>
     <td>
      <ul>
        <li>Finish up prompting for the LLM and the appropriate endpoints and API calls.
</li>
      </ul> 
    </td>
  </tr>
  <tr>
    <td>Week 8/9</td>
    <td>
       <ul>
      </ul>
    </td>
    <td>
      <ul>
        <li>Refine styling and other tweaks to pages/components, make sure everything is integrated well.
</li>
      </ul> 
    </td>
    <td>
      <ul>
        <li>Test for bugs and any server side issues, make sure API endpoints are ready for use by the front-end for demo</li>
      </ul> 
    </td>
  </tr>
  <tr>
    <td>Week 10</td>
    <td>Test everything and fix any outstanding bugs. Have fun on presentation night!</td>
    <td></td>
    <td></td>
  </tr>
</table>

## Stretch Goals 💪

* Integrate with other calendar services (Outlook, iPhone, etc) or a built in calendar.
* Shared calendar(s) between users
* Automatic event/task categorization and/or prioritization
* Proactive time management recommendations (helpful tips based on user’s calendar activity)
* Deployment + Real Users :0

## GitHub Cheat Sheet 💬


| Command | Description |
| ------ | ------ |
| **cd <director>** | Change directories over to our repository |
| **git branch** | Lists branches for you |
| **git branch "branch name"** | Makes new branch |
| **git checkout "branch name"** | Switch to branch |
| **git checkout -b "branch name"** | Same as 2 previous commands together |
| **git add .**| Finds all changed files |
| **git commit -m "Testing123"** | Commit with message |
| **git push origin "branch"** | Push to branch |
| **git pull origin "branch"** | Pull updates from a specific branch |
| get commit hash (find on github or in terminal run **git log --oneline** ) then **git revert 2f5451f --no-edit**| Undo a commit that has been pushed |
| **git reset --soft HEAD~** | Undo commit (not pushed) but *keep* the changes |
| get commit hash then **git reset --hard 2f5451f** | Undo commit (not pushed) and *remove*  changes |

## The Team 🎉

<div align="center">
<h2>🎊Developers🎊</h2>
<h3>Suhani Rana</h3><br/>
<h3>Krish Arora</h3><br/>
<h3>Harsh Patel</h3><br/>
<h3>Sreenidhi Palaniappan</h3><br/>
<h2>🎊Project Manager🎊</h2>
<h3>Lerich Osay</h3><br/>
<h2>🎊Industry Mentor🎊</h2>
<h3>Linh Ly</h3><br/>
<div />
