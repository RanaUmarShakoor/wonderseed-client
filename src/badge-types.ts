export enum BadgeType {
  Superhero = "superhero",
  Streak = "streak",
  Achievement = "achievement"
}

// @ts-ignore
window.BadgeType = BadgeType;

export function badgeToString(btype: BadgeType): string {
  switch (btype) {
    case BadgeType.Superhero:
      return "Superhero Badge";
    case BadgeType.Streak:
      return "Streak Badge";
    case BadgeType.Achievement:
      return "Achievement Badge";
  }

  return "unknown";
}
