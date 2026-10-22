# Survival Horror FPS — Unreal Engine Field Guide

A practical field guide to making a first-person horror game in Unreal Engine: build tension through player decisions, make danger legible, and prove the core experience before scaling up.

**Topics:** Unreal Engine 5 · First-person · Single-player · Design and production

> **Working principle:** Fear is not darkness or loud noises by themselves. It is the player's anticipation of a meaningful risk, uncertainty about what happens next, and belief that their choices matter.

## 1. Start with a promise you can build

Write one sentence that tells the team what the player does, what makes it dangerous, and what makes this game distinct. For example: “Explore a flooded research station, using unreliable tools and sound to avoid creatures that learn where you make noise.” Treat that as a test for every feature.

### Define the constraints early

- **Scope:** solo or team, target platforms, expected play time, and realistic content capacity.
- **Point of view:** decide what the player can see, carry, interact with, and communicate through animation.
- **Threat model:** decide what creates pressure—limited resources, pursuit, uncertainty, vulnerability, or a deliberate combination.
- **References:** identify specific mechanics, moods, or pacing to learn from; do not treat another game's whole identity as a design spec.

Choose a target Unreal Engine version and keep the project, plugins, and team workflow aligned to it. Engine features and defaults change across releases, so verify version-specific setup in Epic's documentation.

## 2. Design a fear loop, not a string of shocks

A dependable encounter rhythm is **orient → notice a clue → form a plan → commit → face a consequence → recover**. Vary the length and intensity of each beat. Repeated maximum intensity makes players numb; uninterrupted calm makes danger feel irrelevant.

- Give the player time and information to anticipate danger, without making every clue a guaranteed attack.
- Make decisions carry trade-offs: spend ammunition now, risk a detour, hide and lose time, or use a loud tool.
- Let quiet moments do work—navigation, aftermath, safe-room routines, and environmental storytelling can reset attention.
- Use a scare only when it changes the player's understanding or decision, not as a substitute for tension.

Prototype a short encounter with placeholder art and sound. If it is not tense when grayboxed, more detail is unlikely to repair its underlying decisions.

## 3. Make first person feel deliberate

Movement and camera response are part of the horror. Start with predictable input, clear interaction range, readable weapon handling, and comfortable camera motion. Tune acceleration, turning, stopping distance, recoil, and interaction feedback in a repeatable test map.

- Use Unreal's Enhanced Input where appropriate to keep actions and input mappings manageable.
- Separate locomotion, camera, weapon, and interaction responsibilities instead of growing one monolithic character Blueprint.
- Make item pickup, blocked interaction, reload, damage, and low-resource states visibly and audibly distinct.
- Offer options for sensitivity, invert-Y, field of view where suitable, and camera shake/motion reduction. Test the actual options, not just the menu.

Build a small interaction vocabulary—inspect, pick up, use, unlock, hide—and keep prompts and input behavior consistent. Avoid context-sensitive surprises that make a failed action look like player error.

## 4. Make scarcity create choices, not frustration

Scarcity works when the player can understand the cost of an action. Track ammunition, healing, durability, and defensive tools as a budget across encounters. A scarce resource should solve a real problem, and the player should have alternatives when possible.

- Give weapons distinct jobs: interruption, precision, escape, or area control—not merely different damage numbers.
- Communicate hit confirmation, stagger, armor, and weak points clearly enough that misses are diagnosable.
- Make inventory limits and item comparisons readable; support examine/inspect controls without forcing them for basic comprehension.
- Place rewards after considering what they teach and which future choices they enable, not only where there is empty space.

Balance from observed playtests. Record what players carry, what they spend, where they stop progressing, and whether they can explain why they made a choice. Do not rely on a single intended route through the resource economy.

## 5. Build threats the player can read

An enemy needs a recognizable presence, a discoverable rule, a response window, and a consequence. Players can fear a powerful threat while still believing the encounter is fair if they can learn its signals and make informed choices.

- Prototype a compact state model: patrol or idle, investigate, pursue, attack, recover, and return or search.
- Use Unreal AI Perception for supported sight/hearing sensing, Navigation Mesh for navigation, and Behavior Trees or another clear state approach where they fit the design.
- Make transitions observable: footsteps, vocalizations, animation, lighting, or environmental reaction can signal detection and intent.
- Handle edge cases intentionally: lost line of sight, unreachable targets, doorways, stun/recovery, and leaving the playable area.

Keep the AI responsible for decisions and the character responsible for movement and presentation. Test with debug visualization enabled; then test again without it to verify players receive equivalent useful cues.

## 6. Shape spaces, routes, and pacing

Block out routes before dressing rooms. A useful space offers a clear immediate goal, landmarks for orientation, and meaningful choices about exposure, noise, supplies, or time. Loops, shortcuts, gates, and revisits can make a compact map feel connected without multiplying unique content.

- Use lighting, silhouette, composition, and environmental landmarks to guide attention without turning every path into a bright arrow.
- Show players what an obstacle requires before asking them to search widely for its solution.
- Plan sightlines and cover together; test how the player and enemy perceive the same room.
- Place checkpoints and save opportunities around meaningful progress and expected loss, not arbitrary map distance.

Test the graybox with a player who has not seen the map. Watch where they look, where they hesitate, what they remember, and whether they understand a route's risk. Fix spatial communication before adding more props.

## 7. Structure the Unreal project for iteration

Favor small, testable systems with explicit ownership. Blueprints are excellent for iteration and content wiring; C++ can be useful for shared foundations, performance-sensitive work, or stronger compile-time structure. Choose based on team needs, not ideology.

- Use components for reusable concerns such as health, interaction, inventory, or perception integrations.
- Use data assets or another clear data-driven pattern for item/enemy tuning so balance changes do not require editing unrelated behavior.
- Keep UI presentation separate from game rules. Drive HUD and inventory from state/events rather than polling every frame.
- Use level streaming or World Partition when the project's map and workflow benefit from it; make the choice early enough to avoid costly content migration.
- Organize content by feature or ownership, establish naming and asset conventions, and keep source control and large binary asset workflows tested from day one.

Build a vertical slice with one room, one threat, one weapon or defensive tool, one resource decision, one save/checkpoint, and one complete start-to-finish encounter. Measure iteration speed before expanding the content plan.

## 8. Use sound and light deliberately

Sound conveys distance, material, direction, and enemy intent. Use consistent audio cues for gameplay-critical states, then add ambience and silence to build mood. Avoid masking important signals with music or effects that compete for the same frequency and attention.

- Use attenuation and spatialization so distance and direction help navigation and threat assessment.
- Consider concurrency, priorities, and submix routing so repeated effects do not overwhelm key cues.
- Use dynamic lighting and effects intentionally; profile the actual target hardware instead of assuming a feature is affordable.
- Provide subtitles for spoken information and captions or visual alternatives for essential sound cues.

Build a lighting pass around navigation, concealment, and reveal. Validate the same scene at intended display settings, with brightness adjustments, and on the lowest target spec. Do not make critical progress depend on distinctions some players cannot see.

## 9. Protect performance and the team's workflow

Set a target platform, frame rate, resolution, and minimum spec before content production. Profile representative gameplay on the weakest supported hardware. Unreal's profiling tools—including Unreal Insights and GPU profiling views—help identify real bottlenecks; optimize measured work rather than guessing.

- Check CPU, GPU, memory, shader compilation, loading, and streaming—not only average frame rate.
- Use scalable settings and test quality tiers. Lighting, shadows, translucency, effects, and post-processing can have very different costs.
- Establish source control, backups, review practices, and a reproducible packaged build early. Test merge and restore workflows with the project's actual assets.
- Keep a risk list for content volume, animation coverage, localization, platform certification, and late technical changes.
- Use short playable milestones and protect time for bug fixing, accessibility, and polish rather than scheduling only feature completion.

## 10. Test, tune, and ship

Observe without coaching. Ask testers to think aloud only when that will not distort a tense sequence; otherwise observe first and interview afterward. Distinguish a deliberate moment of uncertainty from accidental confusion by asking what they believed, what they tried, and what feedback they noticed.

- Test first-time navigation, combat readability, resource decisions, checkpoint recovery, and accessibility options.
- Test a clean install and packaged build, not just Play-in-Editor. Verify input, save/load, resolution, audio, and progression after restart.
- Track reproducible bugs with build, map, steps, expected result, actual result, and severity.
- Run repeated playthroughs after changes to encounter logic, save systems, streaming, or progression.

### Vertical-slice exit checklist

- [ ] One complete, replayable encounter
- [ ] Readable movement and interaction
- [ ] Threat tells and counterplay understood
- [ ] Resource choices have visible consequences
- [ ] Save, death, and retry work reliably
- [ ] Packaged build meets the target budget
- [ ] Essential cues have accessible alternatives
- [ ] New players can find the next objective

Expand only after this slice is enjoyable, understandable, and technically repeatable. A focused, finished experience is more valuable than a broad feature list held together by placeholders.

> **Keep learning:** Check Epic's official Unreal Engine documentation for version-specific details, and validate design assumptions with playtests. A field guide is a starting framework; the game itself supplies the evidence.
