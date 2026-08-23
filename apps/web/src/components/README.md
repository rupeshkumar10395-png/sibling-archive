# Component boundaries

`marketing/` is the public landing page.

`archive/` renders the actual memory archive.

`creation/` will contain the creator workspace.

`memories/` will contain reusable memory renderers such as PhotoMemory, QuestionMemory, ChatMemory and CourtMemory.

`shared/` is for primitives that are reused across product surfaces.

Keep business/API calls out of visual memory components; pass typed data into them.
