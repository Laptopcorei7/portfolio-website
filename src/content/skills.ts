import type { SkillGroup } from "./types";

/* ===========================================================================
   All five groups CONFIRMED by Hananiah 2026-07-29.
   Explicitly ruled out — do not re-add: Java, Kotlin, React Native,
   Spring Boot, Firebase.
   =========================================================================== */

/**
 * Rendered as a grid of bordered boxes. Order here is the order shown; group
 * sizes can differ freely, and boxes size to their contents.
 */
export const skillGroups: SkillGroup[] = [
  { title: "Languages", items: ["Python", "JavaScript", "Dart"] },
  { title: "Mobile", items: ["Flutter", "Android SDK"] },
  { title: "Backend", items: ["Node.js", "Express", "REST"] },
  { title: "Databases", items: ["PostgreSQL", "MongoDB", "MySQL"] },
  { title: "Tools", items: ["Git", "Docker", "Postman", "Android Studio", "VS Code"] },
];
