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

```sql
-- User table
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ChatSpace table
CREATE TABLE "ChatSpace" (
    "id" SERIAL PRIMARY KEY,
    "ownerId" INTEGER NOT NULL,
    "url" TEXT NOT NULL UNIQUE,
    "isPrivate" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Invitation table
CREATE TABLE "Invitation" (
    "id" SERIAL PRIMARY KEY,
    "chatSpaceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY ("chatSpaceId") REFERENCES "ChatSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create intermediate table for ChatSpace members
CREATE TABLE "ChatSpaceMember" (
    "chatSpaceId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,

    FOREIGN KEY ("chatSpaceId") REFERENCES "ChatSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("chatSpaceId", "memberId")
);
```

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
