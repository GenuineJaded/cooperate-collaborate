Cooperative Collaboration Encasement — Distillation




What It Is

A field. A dark space where people leave things — writing, music, art — without accounts, without profiles, without permanence guaranteed. Things are held in the field by the attention of whoever finds them. When attention moves away, they darken. When their time runs out, they are gone.

That is the whole project.




What It Actually Needs

A database with four tables

artifacts — the things left in the field.
Each artifact has: a body (text), an optional name (Nāma), an optional file attachment, a type (writing / music / art), a life counter that starts at seven days, a purple shade (0–7) that deepens with inactivity, and a created timestamp.

quips — responses to artifacts.
Structurally the same as an artifact: body, optional name, optional file. Belongs to one artifact. Leaving a quip extends that artifact's life. Design. Behind each door. Only see the posts, the colors, and the text or whatever fits in the preview box. Each artifact when clicked holds the potentil to open into a whole new sort of field.

interactions — a log of views and quips.
Each record says: this artifact was viewed, or quipped, at this time. Views add six hours of life. Quips add eighteen. This is internally kept note of. It is not made explicit. The changes in color are what make participation explicit.

intimate_iterations — ephemeral two-person conversations scoped to one artifact and two anonymous browser sessions. No accounts. When the session clears, it is gone. That is not a limitation. That is the design.




A decay process

Runs perpetually on a timer. For each artifact: calculates how long it has been since the last interaction. Every eighteen hours of inactivity degrades the shade of purple by one step. Every quip adds 18 hours of time to the artifacts lifespan, every view adds 6 hours. Every 24 hours the hue of purple increases by 1. When an artifact's total lifespan is exhausted, delete it — along with its quips, its interactions, its intimate threads. Not archived. Deleted. The code calls this compost.

The shade palette runs from near-white (shade 0, new and held) through violet to near-black (shade 7, almost gone). The color is the artifact's state of being attended to.




Two pages - Three Doors

Landing — You are here.
Nothing begins until you move.
Three doors.
The labels are inherited. Insufficient. Used anyway.
Your choice of door is part of what you leave.
writing · music · art
Held while in contact.
Released in absence.
Propping is permitted. The cost is visible.
What stays, stays because someone is still here with it.

Rich purple bold text.

Button underneath, surrounded by purple band - leading into next room. Reads "Pātha"

Field — the main space. Filtered by 3 doors. writing, music, and art. Behind each door is a similar, but seperate, enviornment. A button to draft a new artifact, specifically named "Craft Artifact". Each card shows the body, the name if given, the file if present, a quip (comment) button, intentional lower case letters, and a small unlabeled fractal heart in the corner that opens the intimate collaborate space. Both the Quip and Craft Artifact windows look similar. A box, with 2 rectangles on top and bottom. The top one. Has text centered - Artifact or quip. The text blinks. Often enough to catch attention, not too often to distract. Allowing for editing of what it is, to them. This nuance plays an important psychological need.

The draft modal — opens over the field. A blinking label (editable, defaults to "Artifact"). A large text area. An optional name field (Nāma). An optional file attachment. A submit button that says "Place." Before uploading a file, a pause screen appears with a quiet reminder: you cannot remove what you leave here, and containers fill. If there is another route for sharing your work, perhaps use that instead. This has a button, allowing you to disengage the pop up from popping up, while on the site. Although there is not yet persistance built into the concept.




Anonymous sessions

No login. No accounts. Each visitor is identified by a random ID stored in their browser session. That ID is used only to scope intimate threads — so two people can find each other in the same conversation. It is not stored against any identity. It is not tracked.




One perceptual control

A small panel, fixed at the edge of the field, lets each visitor shift the background and text colors of the space for themselves alone. The changes are local. The field looks different to each person who adjusts it.




What It Does Not Need

It does not need login. It does not need user accounts or roles. It does not need AI language models, image generation, voice transcription, or a notification system. It does not need Google Maps. It does not need an external data API. It does not need forty UI component library files. It does not need an analytics endpoint. It does not need a dashboard layout or an admin panel.

It needs a database, a decay process, three pages, and the restraint to leave everything else out.




What a Clean Stack Looks Like

The project as conceived is a server-rendered or API-backed single-page application with a database. The technology does not matter much. What matters is that it is small, that it runs without a platform dependency, and that the next person who opens the code can read it in an afternoon.

A reasonable minimal stack: a Node.js server (Express or Hono), a small SQL database (SQLite is sufficient — the field does not need to be large), Drizzle ORM or raw SQL, a React frontend with no component library beyond what is actually used, and plain CSS or a minimal Tailwind configuration. The entire server logic — artifacts, quips, interactions, decay, intimate threads — fits comfortably in two files. The entire frontend fits in five components.

The decay process is a cron job or a scheduled HTTP call to a single endpoint. It does not need to be complex.




The Name

This is the Cooperative Collaborative space of a collective known vaguely as the Coherent Cabal. A coherent cabal coheres around something unnamed — something held because the people in it hold it.

The project is asking whether knowing something will not last unless someone stays with it changes what you put there. Whether that changes how carefully you make it. Whether the field, because it asks something of you, receives something truer than a platform that asks nothing.

