# Telling the assistant what your app's data means

SmartLinks keeps a business's data in standard objects: work orders, containers and stock, bookings,
records, contacts, history. The assistant can read all of them. What it can't know is what they **mean in
your app**: that a work order is a job, that a container of type `drum` is a drum of juice, that a
booking with `data.event = "christmas-fair"` is a stall at the school fair.

Tell it, in the manifest's `assistant` block, beside any skills and knowledge files
([assistant-apps.md](assistant-apps.md)). Four keys:

```jsonc
// app.manifest.json
"assistant": {
  "purpose": "Production manager for a fragrance filling and decorating factory: jobs from sales order to put-away.",
  "objects": [
    {
      "object": "workOrder",
      "where": { "appId": "accord-production" },
      "means": "A job.",
      "fields": {
        "ref": "job number, from the sales order",
        "kind": "job type: FillOnly, DecorateOnly, CompleteJob, PackagingOnly, Conversion",
        "dueAt": "target date",
        "data.stage": "the stage shown on screen",
        "stages": "picking, then decoration, filling, packaging (\"boxing\" on screen), wrapping"
      },
      "write": "actions"
    },
    { "object": "container", "where": { "containerType": "drum" }, "means": "A drum of bulk juice; its ref is the batch number.", "write": "actions" },
    { "object": "container", "where": { "containerType": "location" }, "means": "A place in the factory.", "write": "direct" },
    { "object": "history", "where": { "type": "job.*" }, "means": "A job's timeline.", "write": "none" }
  ],
  "words": {
    "GMP": "the batch manufacturing record printed for each job",
    "the diary": "production runs by day"
  },
  "recipes": [
    { "question": "What's on tomorrow?", "answer": "this app's work order stages planned for that day, by stage; show machine or crew" },
    { "question": "Which jobs are late?", "answer": "use the action jobs.late: it applies the app's own rule for late" }
  ]
}
```

| Key | What it is | Limit |
|---|---|---|
| `purpose` | One line on what the app or site is for. The assistant always has it in view. | 200 characters |
| `objects` | What each standard object means here, and whether the assistant may change it. | 20 |
| `words` | The business's own terms. | 40 |
| `recipes` | How to answer the questions people actually ask. | 30 |

All four together: at most 6,000 characters. The assistant reads this every time a question touches your
app, so short wins. Anything malformed is left out and anything too long is cut (recipes first), without
an error: check what you wrote reads well.

## Objects

- **`object`**: the standard object: `workOrder`, `workOrderStage`, `container`, `stock`, `booking`,
  `record`, `contact`, `product`, `history`.
- **`where`**: which ones, with the filters the SDK takes (`appId`, `containerType`, `recordType`,
  `data.<field>`).
- **`means`**: what it is here, in a sentence.
- **`fields`**: only the fields whose name doesn't say what they hold.
- **`write`**: may the assistant change it?

| `write` | Means |
|---|---|
| `direct` | Through the API, as a planned change the person applies. |
| `actions` | **Only through one of your app's actions**, never another way. |
| `none` | Never. |
| absent | Nothing is said; the platform's usual rules apply. |

**Record types you declared in the `data` block don't need repeating.** The assistant gets their titles
and fields from there ([admin-lists-and-pickers.md](admin-lists-and-pickers.md)); add an `objects`
entry only to say what one means or to set its `write` rule.

## Actions, when changing something has rules

If creating or changing a thing involves rules that live in your code (a number from a counter, a check,
someone who must be told), don't describe the rules and hope: mark the object `"write": "actions"` and
give the assistant an **action** that does it. An action is one of your functions offered as a tool
([agent-tools.md](agent-tools.md)):

```jsonc
{
  "name": "run.plan",
  "trigger": { "type": "http", "methods": ["POST"] },
  "agent": {
    "tool": true,
    "audience": ["assistant"],
    "title": "Plan a production run",
    "description": "Plan one stage of a job for a day, by hand or on a machine, with its crew.",
    "input": { "type": "object", "properties": { "job": { "type": "string" }, "stage": { "type": "string" }, "date": { "type": "string" } }, "required": ["job", "stage", "date"] },
    "approval": "require"
  }
}
```

Your rules then run in code every time. Keep actions few and coarse: one "find jobs" with filters, not
five narrow ones. Use `"approval": "require"` for anything that changes or sends something: the person
confirms it on a card.

## A site speaks for the business

A site is the business's own app, so its description is about the **business**:

- its `purpose` leads the assistant's map of the business;
- it may describe objects that **other installed apps** keep. Narrow them with `where.appId`:

  ```jsonc
  { "object": "booking", "where": { "appId": "appointment-booking", "data.event": "christmas-fair" }, "means": "A stall at the Christmas fair." }
  ```

- where the site and an app describe the same object, the site's meaning comes first.

So "how many bookings for the Christmas fair?" is answered from the right bookings.

## Types

`AppAssistantDeclaration` (`purpose`, `objects`, `words`, `recipes`), `AssistantObject`, `AssistantRecipe`.
