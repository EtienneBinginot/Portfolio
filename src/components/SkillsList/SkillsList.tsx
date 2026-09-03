import type { Case, Project, Skill } from "@/lib/schema";
import { resolveContentHref } from "@/lib/schema";
import Badge from "@/components/Badge/Badge";
import styles from "./SkillsList.module.scss";

type SkillsListProps = {
  skills: Skill[];
  projects: Project[];
  cases: Case[];
};

export default function SkillsList({
  skills,
  projects,
  cases,
}: SkillsListProps) {
  // Regroupement en une passe : la validation Zod (`DataSchema`) garantit
  // déjà que `evidence` résout, mais `resolveContentHref` reste le filet de
  // sécurité au rendu — une compétence qui ne résout pas est simplement
  // absente du groupe plutôt que de casser l'affichage.
  const groups = skills.reduce<Map<string, { name: string; href: string }[]>>(
    (acc, skill) => {
      const href = resolveContentHref(skill.evidence, { projects, cases });
      if (!href) return acc;
      const group = acc.get(skill.category) ?? [];
      group.push({ name: skill.name, href });
      acc.set(skill.category, group);
      return acc;
    },
    new Map(),
  );

  if (groups.size === 0) return null;

  return (
    <div className={styles.groups}>
      {Array.from(groups, ([category, categorySkills]) => (
        <div key={category} className={styles.group}>
          <h3 className={styles.category}>{category}</h3>
          <ul className={styles.badgeList}>
            {categorySkills.map((skill) => (
              <li key={skill.name}>
                <Badge as="link" href={skill.href}>
                  {skill.name}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
