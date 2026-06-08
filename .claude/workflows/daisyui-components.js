export const meta = {
  name: "daisyui-components-workflow",
  description: "Add DaisyUI components as Wagtail StreamField blocks and update templates",
  phases: [
    { title: "Create Blocks", detail: "Define all new StreamField blocks in blocks.py" },
    { title: "Create Templates", detail: "Create HTML templates for all new blocks" },
    { title: "Rewrite Navbar", detail: "Rewrite base.html navbar with DaisyUI navbar component" },
    { title: "Mask Hero Filter", detail: "Mask for author image, Hero for homepage, Filter for blog sidebar" },
    { title: "Wire Up", detail: "Register blocks in models.py" },
    { title: "Verify", detail: "Run Django check, verify imports" },
  ],
}

phase("Create Blocks")

const blocksAgent = await agent(
  "Create ALL new StreamField block classes in apps/blog/blocks.py. Read the current file first, then add these blocks at the END.\n" +
  "Read D:\\Programming\\blog\\apps\\blog\\blocks.py first to see current state.\n" +
  "Add these imports at top if not present: CharBlock, TextBlock, RichTextBlock, BooleanBlock, IntegerBlock from wagtail.blocks (check what's already imported).\n\n" +

  "=== BLOCK 1: AOSTabBlock ===\n" +
  "AOSTabItemBlock (StructBlock): title (CharBlock), content (TextBlock), icon (ChoiceBlock with code/lightning-bolt/shield/chart-bar/globe/puzzle-piece, required=False).\n" +
  "AOSTabBlock (extends AOSBlock): tabs (ListBlock of AOSTabItemBlock, min 2 max 6), variant (ChoiceBlock: border/box/lift, default border).\n" +
  "Meta: icon='bookmark', label='Tab Panel', template='blog/blocks/aos_tab.html', group='Interactive'\n\n" +

  "=== BLOCK 2: AOSTimelineBlock ===\n" +
  "AOSTimelineItemBlock (StructBlock): title (CharBlock), description (TextBlock), timestamp (CharBlock required=False).\n" +
  "AOSTimelineBlock (extends AOSBlock): items (ListBlock of AOSTimelineItemBlock, min 2 max 10), compact (BooleanBlock default=False).\n" +
  "Meta: icon='history', label='Timeline', template='blog/blocks/aos_timeline.html', group='Interactive'\n\n" +

  "=== BLOCK 3: AOSStepsBlock ===\n" +
  "AOSStepItemBlock (StructBlock): title (CharBlock), description (TextBlock required=False).\n" +
  "AOSStepsBlock (extends AOSBlock): steps (ListBlock of AOSStepItemBlock, min 2 max 8), active_step (IntegerBlock default=1), vertical (BooleanBlock default=True).\n" +
  "Meta: icon='list', label='Steps', template='blog/blocks/aos_steps.html', group='Interactive'\n\n" +

  "=== BLOCK 4: AOSAlertBlock ===\n" +
  "AOSAlertBlock (extends AOSBlock): title (CharBlock), message (TextBlock), variant (ChoiceBlock: info/success/warning/error, default info).\n" +
  "Meta: icon='alert-circle', label='Alert', template='blog/blocks/aos_alert.html', group='Interactive'\n\n" +

  "=== BLOCK 5: AOSTooltipWrapperBlock ===\n" +
  "AOSTooltipWrapperBlock (StructBlock, NOT extending AOSBlock): inner_text (CharBlock), tooltip_text (CharBlock), placement (ChoiceBlock: top/bottom/left/right, default top), variant (ChoiceBlock: default/primary/secondary/accent, default default), animation (ChoiceBlock using AOS_EFFECTS + [('none','None')], default 'fade-up'), delay (ChoiceBlock same as AOSBlock delay).\n" +
  "Meta: icon='message-circle', label='Tooltip', template='blog/blocks/aos_tooltip.html', group='Interactive'\n\n" +

  "IMPORTANT:\n" +
  "- Read the file FIRST to see exact current content\n" +
  "- Add imports if needed at top\n" +
  "- Append ALL 5 new block classes at the END of the file\n" +
  "- Use Edit tool for each addition\n" +
  "- Follow exact same pattern as existing AOS blocks\n" +
  "- Write the actual code to the file via Edit tool\n" +
  "- After creating blocks, report what you added.",
  {label: "Create all new blocks", phase: "Create Blocks", schema: {
    type: "object",
    properties: {
      blocksAdded: { type: "array", items: { type: "string" } },
      importsAdded: { type: "array", items: { type: "string" } },
      fileModified: { type: "string" }
    }
  }})

phase("Create Templates")

const templatesAgent = await agent(
  "Create HTML templates for all 5 new StreamField blocks. Read existing block templates first to understand the pattern.\n" +
  "Read these files to understand the pattern:\n" +
  "- D:\\Programming\\blog\\apps\\blog\\templates\\blog\\blocks\\aos_highlight.html\n" +
  "- D:\\Programming\\blog\\apps\\blog\\templates\\blog\\blocks\\aos_callout.html\n" +
  "- D:\\Programming\\blog\\apps\\blog\\templates\\blog\\blocks\\aos_card_grid.html\n\n" +

  "Then create these 5 template files in D:\\Programming\\blog\\apps\\blog\\templates\\blog\\blocks\\ using the Write tool.\n\n" +

  "TEMPLATE 1: aos_tab.html\n" +
  "- DaisyUI tabs-box variant with radio inputs for interactivity\n" +
  "- Outer div with data-aos animation attributes\n" +
  "- div[role=tablist] with class 'tabs tabs-' + variant\n" +
  "- Each tab gets a radio input with class 'tab' + variant classes, first one checked with 'tab-active'\n" +
  "- After tablist, each tab gets a div[role=tabpanel] with content bg-base-200/50 border rounded-b-xl\n" +
  "- If tab has icon, render it with {% icon tab.icon size=16 %}\n" +
  "- Show tab title (h3 font-semibold) and content (text-sm whitespace-pre-line)\n" +
  "- Use {% load wagtailcore_tags site_tags %}\n\n" +

  "TEMPLATE 2: aos_timeline.html\n" +
  "- DaisyUI timeline component vertical\n" +
  "- Outer div with data-aos animation attributes\n" +
  "- ul.timeline with optional 'timeline-compact' class\n" +
  "- Each item: li with timeline-start (title + description right-aligned), timeline-middle (circle icon in primary color), timeline-end (timestamp in monospace)\n" +
  "- Between items: hr.bg-base-300\n" +
  "- Use {% load site_tags %}\n\n" +

  "TEMPLATE 3: aos_steps.html\n" +
  "- DaisyUI steps component\n" +
  "- Outer div with data-aos animation attributes\n" +
  "- ul.steps with optional 'steps-vertical' or 'steps-horizontal'\n" +
  "- Each step: li.step, if forloop.counter <= active_step add 'step-primary'\n" +
  "- Inside each step: show title (h3 font-semibold) and optional description\n" +
  "- Use {% load site_tags %}\n\n" +

  "TEMPLATE 4: aos_alert.html\n" +
  "- DaisyUI alert with rounded-2xl corners\n" +
  "- Outer div with data-aos animation attributes\n" +
  "- div[role=alert] with class 'alert alert-' + variant + ' rounded-2xl border border-base-300/50 shadow-lg'\n" +
  "- Inside: title (font-bold) + message (text-sm whitespace-pre-line)\n" +
  "- Use {% load site_tags %}\n\n" +

  "TEMPLATE 5: aos_tooltip.html\n" +
  "- DaisyUI tooltip wrapper\n" +
  "- Outer div with data-aos (only if animation != 'none')\n" +
  "- Inner div with class 'tooltip tooltip-' + placement + optional 'tooltip-' + variant\n" +
  "- data-tip attribute with tooltip_text\n" +
  "- Inside: span with underlined dashed primary text and cursor-help\n" +
  "- Use {% load site_tags %}\n\n" +

  "IMPORTANT:\n" +
  "- Create all 5 files using the Write tool\n" +
  "- Follow exact same pattern as existing templates (data-aos attributes, Tailwind classes)\n" +
  "- After creating, list all files created",
  {label: "Create all block templates", phase: "Create Templates", schema: {
    type: "object",
    properties: {
      templatesCreated: { type: "array", items: { type: "string" } }
    }
  }})

phase("Rewrite Navbar")

const navbarAgent = await agent(
  "Rewrite the navbar in base.html to use DaisyUI navbar component classes.\n" +
  "Read D:\\Programming\\blog\\core\\templates\\base.html first.\n\n" +

  "Current navbar (lines 76-128) uses custom flex layout. Change to DaisyUI navbar structure:\n" +
  "- Wrap nav element with class 'navbar w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-colors duration-300'\n" +
  "- Use 'navbar-start' div for the logo link\n" +
  "- Use 'navbar-center hidden md:flex' div for desktop nav links (About, Blog, Projects, Contact)\n" +
  "- Use 'navbar-end' div for search button, theme toggle, and mobile menu button\n" +
  "- Keep ALL existing functionality: HTMX boost context, search button server-side visibility {% if %}, theme toggle, mobile menu button, icons\n" +
  "- Keep the mobile menu dropdown, search dialog, boost-root div, footer, and ALL scripts EXACTLY unchanged\n" +
  "- Only change the navbar section structure\n\n" +

  "The navbar-start should contain the logo link.\n" +
  "The navbar-center should contain the 4 nav links (About, Blog, Projects, Contact).\n" +
  "The navbar-end should contain: search button (with {% if %} conditional), theme toggle button, and mobile menu hamburger button (in md:hidden flex container).\n\n" +

  "IMPORTANT:\n" +
  "- Read the file first\n" +
  "- Use Edit tool to replace only the navbar section\n" +
  "- Do NOT touch mobile menu, search dialog, scripts, or footer\n" +
  "- After editing, report what changed",
  {label: "Rewrite navbar with DaisyUI", phase: "Rewrite Navbar", schema: {
    type: "object",
    properties: {
      changes: { type: "string" },
      fileModified: { type: "string" }
    }
  }})

phase("Mask Hero Filter")

const componentsAgent = await agent(
  "Make 3 template changes: Mask for author image, Hero for homepage, Filter for blog sidebar mood filter.\n\n" +

  "CHANGE 1 - Mask for author image:\n" +
  "Read D:\\Programming\\blog\\apps\\blog\\templates\\blog\\blog_page.html\n" +
  "Find the author avatar section around line 86-89. It currently has:\n" +
  '  <div class="avatar online"> <div class="w-10 rounded-full"> <img src="..." class="w-full h-full object-cover"> ... </div> </div>\n' +
  "Replace with DaisyUI mask:\n" +
  '  <div class="avatar online"> <div class="w-10"> <img src="..." class="mask mask-circle"> ... </div> </div>\n' +
  "Remove rounded-full from inner div, remove w-full h-full object-cover from img, add mask mask-circle to img.\n\n" +

  "CHANGE 2 - Hero for homepage:\n" +
  "Read D:\\Programming\\blog\\apps\\home\\templates\\home\\home_page.html\n" +
  "Find the hero section with the hero title, subtitle, and CTAs.\n" +
  "Wrap the hero content in DaisyUI hero component:\n" +
  "  <div class='hero bg-base-100 min-h-[60vh]'>\n" +
  "    <div class='hero-content max-w-7xl mx-auto px-4'>\n" +
  "      ... existing hero content (title, subtitle, CTAs) ...\n" +
  "    </div>\n" +
  "  </div>\n" +
  "Keep ALL existing content, styling, AOS attributes. Only add the hero wrapper divs.\n" +
  "If the hero section is the first major section, wrap just that section.\n\n" +

  "CHANGE 3 - Filter for blog sidebar mood filter:\n" +
  "Read D:\\Programming\\blog\\apps\\blog\\templates\\blog\\blog_index_page.html\n" +
  "Find the 'Browse by Mood' sidebar section around line 159-177.\n" +
  "Add a DaisyUI filter form ABOVE the existing mood badge links:\n" +
  "  <form class='filter' action='{% pageurl page %}' method='get'>\n" +
  "    <input class='btn btn-ghost btn-sm filter-reset' type='reset' aria-label='Reset' />\n" +
  "    {% for mood_key, mood_label in mood_choices %}\n" +
  "      <input class='btn btn-ghost btn-sm' type='radio' name='mood' value='{{ mood_key }}' aria-label='{{ mood_label }}' {% if request_mood == mood_key %}checked{% endif %} />\n" +
  "    {% endfor %}\n" +
  "    {% if request_tag %}<input type='hidden' name='tag' value='{{ request_tag }}' />{% endif %}\n" +
  "  </form>\n" +
  "Keep the existing mood badge visual list below the filter form.\n\n" +

  "IMPORTANT:\n" +
  "- Read each file before editing\n" +
  "- Use Edit tool for each change\n" +
  "- Do NOT change anything else in these files\n" +
  "- Report all 3 changes made",
  {label: "Mask + Hero + Filter changes", phase: "Mask Hero Filter", schema: {
    type: "object",
    properties: {
      maskChange: { type: "string" },
      heroChange: { type: "string" },
      filterChange: { type: "string" }
    }
  }})

phase("Wire Up")

const wireAgent = await agent(
  "Wire up all new blocks to the models. Register them in StreamField definitions.\n\n" +

  "STEP 1 - Update BlogPage.body StreamField:\n" +
  "Read D:\\Programming\\blog\\apps\\blog\\models.py\n" +
  "Add to the existing 'from apps.blog.blocks import' import line, append:\n" +
  "  AOSTabBlock, AOSTimelineBlock, AOSStepsBlock, AOSAlertBlock, AOSTooltipWrapperBlock\n" +
  "Then add to BlogPage.body StreamField list (after existing blocks):\n" +
  '  ("aos_tab", AOSTabBlock()),\n' +
  '  ("aos_timeline", AOSTimelineBlock()),\n' +
  '  ("aos_steps", AOSStepsBlock()),\n' +
  '  ("aos_alert", AOSAlertBlock()),\n' +
  '  ("aos_tooltip", AOSTooltipWrapperBlock()),\n\n' +

  "STEP 2 - Update HomePage.body StreamField:\n" +
  "Read D:\\Programming\\blog\\apps\\home\\models.py\n" +
  "Similarly update the import to add the same 5 new blocks.\n" +
  "Add the same 5 blocks to HomePage.body StreamField list.\n\n" +

  "IMPORTANT:\n" +
  "- Read both files first\n" +
  "- Use Edit tool to add imports and StreamField entries\n" +
  "- Do NOT change anything else in the models\n" +
  "- Report what was added",
  {label: "Wire blocks to models", phase: "Wire Up", schema: {
    type: "object",
    properties: {
      blogPageUpdated: { type: "boolean" },
      homePageUpdated: { type: "boolean" },
      blocksRegistered: { type: "array", items: { type: "string" } }
    }
  }})

// Collect results
const blocksResult = blocksAgent
const templatesResult = templatesAgent
const navbarResult = navbarAgent
const componentsResult = componentsAgent
const wireResult = wireAgent

log("All agents complete. Collecting results...")

return {
  blocksCreated: blocksResult?.blocksAdded || [],
  templatesCreated: templatesResult?.templatesCreated || [],
  navbarRewritten: !!navbarResult,
  maskApplied: !!componentsResult?.maskChange,
  heroApplied: !!componentsResult?.heroChange,
  filterApplied: !!componentsResult?.filterChange,
  modelsWired: wireResult?.blocksRegistered || [],
}
