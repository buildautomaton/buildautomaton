# widget

**Target runtime:** react

BuildAutomaton chat widget: a circle button that opens a popup over the app. The popup is one ACP session. Prompts in that session sit above the composer. The header is one field that switches sessions. Hover the session icon for the working directory, git repo, and branch. Follow-ups keep the session agent and can change the model. A green or red status dot (circle button and open header) is the live websocket to the ACP plugin. A spinner means the open session is running.

Use in any host that should keep the work loop available while the app is on screen.
