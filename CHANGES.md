# Changes Made

This file lists the work done for the tasks in [README.md](README.md), plus the bugs fixed along the way.

## Tasks

### 1. Display time zone on top bar
- The top bar now shows the user's time zone and UTC offset next to the clock, for example `Asia/Karachi (GMT+5)`.
- The time zone is read from the browser, so each user sees their own.
- It is hidden on small screens to save space.
- File: `client/src/Components/Navbar/Navbar.jsx`

### 2. Form validation messages when creating a new Employee
- Replaced the `alert("Make sure to provide all the fields")` popup with a message under each field.
- Required fields: First Name, Last Name, User Name, Password, Phone. Email is optional, but if it is filled in, it must be in a valid format.
- An empty field turns red and shows a message such as "First Name is required".
- A field's error clears as soon as the user types in it. All errors clear when the form is closed.
- File: `client/src/Pages/Users/CreateEmployee.jsx`

### 3. Add Client button and modal
- Added a red **+** button on the Clients page, next to the search box.
- It opens an "Add New Client" form with First Name, Last Name, User Name, Email (optional), Phone and City (optional).
- It uses the same under-field validation messages as the Employee form.
- On success, the form closes, a success message appears, and the new client is added to the table straight away.
- Files:
  - `client/src/Pages/Users/CreateClient.jsx` (new)
  - `client/src/Pages/Users/Topbar.jsx` (button and modal added)

### 4. Client edit feature
- Added a green edit icon to each row in the Clients table.
- It opens an "Edit Client" form already filled with the client's details, with the same validation.
- After saving, the table row updates and a success message appears.
- Only the **super admin** sees the edit icon, because the server's update route (`PUT /user/update/:userId`) only allows the super admin.
- Files:
  - `client/src/Pages/Users/EditClient.jsx` (new)
  - `client/src/Pages/Users/Clients.jsx` (edit icon and modal added)

## Bug Fixes

| Problem | Fix | File |
|---|---|---|
| The Sign Up button never sent the form, because the validation check was reversed. | Corrected the check and added the missing "City is required" validation. | `client/src/Pages/Auth/Register.jsx` |
| The `createClient` action called `navigate`, which was never defined, so it showed an error even when the client was saved. | It now closes the modal and shows a success message instead. | `client/src/redux/action/user.js` |
| The server rejected every new client without an email with "Email already exist". An empty email matched existing users whose email is also empty. | The email is only checked when one is given. A duplicate-username check was also added. | `server/controllers/user.js` |
| Typing in the Email field of the Edit Employee form crashed the page, because it called an undefined `handleChange`. | Changed it to the correct `handleInputChange`. | `client/src/Pages/Users/Edit.jsx` |
| Tables had no height, so the row area collapsed to a thin line: rows were cut off and the "No rows" message was squashed. | Added `autoHeight` to the shared DataGrid, so tables grow to fit their rows. This fixes every table in the app. | `client/src/Components/Table/Table.jsx` |
| Updating a user showed no confirmation. | Added a "User updated successfully" message. | `client/src/redux/action/user.js` |

## Project Setup (done before the tasks)

The project could not run as provided, so the following setup was done first.

### 1. Database: a new MongoDB Atlas cluster
- **Problem:** the backend failed on start with `querySrv ENOTFOUND _mongodb._tcp.crm.e1ltwju.mongodb.net`. A DNS lookup confirmed that this Atlas cluster no longer exists, so the database in the original `.env` could not be used. MongoDB was not installed locally either.
- **Solution:** created a new free MongoDB Atlas cluster:
  1. Created a free **M0** cluster named `M0` in Atlas (Project 0).
  2. Created a **database user** (username and password) for the app to connect with.
  3. Under **Network Access**, allowed connections from anywhere (`0.0.0.0/0`).
  4. Copied the **Node.js driver** connection string from **Connect → Drivers**.
  5. Set `ATLAS_URL` in `server/.env` to that string, with the real password filled in and `/crm` added as the database name:
     ```
     ATLAS_URL=mongodb+srv://<user>:<password>@m0.xxxxx.mongodb.net/crm?retryWrites=true&w=majority&appName=M0
     ```
- **Result:** the backend connects and prints `listening at port 4000`.

### 2. First user: the super admin account
- **Problem:** the new database is empty, so there were no login credentials.
- **Solution:** the first account was created through the Sign Up page (`/auth/register`). The server gives the **super_admin** role to whoever registers with the username set in `SUPER_ADMIN_USERNAME` in `server/.env` (currently `nauman`). That account was registered and is used to log in.
- This needed the Sign Up bug fix listed above, because the Sign Up button did not work before it.

### 3. Running the project
Requires Node.js 18+. Use two terminals:

```bash
# Terminal 1: backend (http://localhost:4000)
cd server
npm install
npm run dev

# Terminal 2: frontend (http://localhost:5173)
cd client
npm install
npm run dev
```

The frontend calls the API at `http://localhost:4000/api/v1`, which is set in `client/src/constant.js`. The backend's `PORT` in `server/.env` must therefore stay `4000`.
