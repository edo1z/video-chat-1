# video-chat-1

## System Requirements

- Upon login, users can create their own dedicated space. When a space is created, a URL is issued.
- Users can create only one space at a time.
- There are two types of spaces: public spaces and private spaces.
- Anyone can join a public space if they know the space's URL.
- Only invited users can join a private space.
- Real-time video and audio communication is possible within the spaces.

## Technologies to be used

- NestJS, Prisma, PostgreSQL, and WebRTC will be used.
- Instead of using frontend frameworks like React, NestJS will utilize a template engine to respond with HTML.

## Database Structure

### User

- id (Int, Primary Key, Auto Increment)
- email (String, Unique)
- password (String)
- createdAt (DateTime)
- updatedAt (DateTime)
- chatSpace (Relation to ChatSpace)

### ChatSpace

- id (Int, Primary Key, Auto Increment)
- ownerId (Int)
- owner (Relation to User)
- url (String, Unique)
- isPrivate (Boolean)
- createdAt (DateTime)
- updatedAt (DateTime)
- members (Relation to User)
- invitations (Relation to Invitation)

### Invitation

- id (Int, Primary Key, Auto Increment)
- chatSpaceId (Int)
- chatSpace (Relation to ChatSpace)
- userId (Int)
- user (Relation to User)
- createdAt (DateTime)
- updatedAt (DateTime)

## Screens

### 1. Login Screen

- Login Required: No
- Display Items: Email input field, password input field, login button, registration link
- Functions: Login
- Transition Destination: Registration screen, Home screen (upon successful login)

### 2. Registration Screen

- Login Required: No
- Display Items: Email input field, password input field, password confirmation input field, register button, login link
- Functions: User registration
- Transition Destination: Login screen, Home screen (upon successful registration)

### 3. Home Screen

- Login Required: Yes
- Display Items: Username, chat space creation button, chat space list, logout button
- Functions: Chat space creation, chat space joining, logout
- Transition Destination: Chat space screen, Login screen (upon logging out)

### 4. Chat Space Creation Screen

- Login Required: Yes
- Display Items: Space name input field, public/private selection, create button, cancel button
- Functions: Chat space creation
- Transition Destination: Home screen, Chat space screen (upon successful creation)

### 5. Chat Space Screen

- Login Required: Yes
- Display Items: Chat space name, participants list, video chat area, audio chat area, invitation link (for private spaces), chat space deletion button, home link
- Functions: Video chat, audio chat, space deletion, invitation link copying (for private spaces)
- Transition Destination: Home screen

### 6. Invitation Link Input Screen (Private Spaces)

- Login Required: Yes
- Display Items: Invitation link input field, join button, cancel button
- Functions: Join private space using invitation link
- Transition Destination: Home screen (upon canceling), Chat space screen (upon successful joining)

### 7. User Settings Screen

- Login Required: Yes
- Display Items: Email address display, password change input field, password change confirmation input field, password change button, account deletion button
- Functions: Password change, account deletion
- Transition Destination: Home screen (upon successful password change), Login screen (after account deletion)

## License

MIT
