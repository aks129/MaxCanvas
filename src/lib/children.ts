import { ChildConfig } from "@/types/app";

export function getChildren(): ChildConfig[] {
  const children: ChildConfig[] = [];
  let i = 1;

  while (true) {
    const name = process.env[`CHILD_${i}_NAME`];
    const token = process.env[`CHILD_${i}_TOKEN`];

    if (!name || !token) break;

    children.push({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      token,
    });

    i++;
  }

  return children;
}

export function getChild(childId: string): ChildConfig | undefined {
  return getChildren().find((c) => c.id === childId);
}

export function getDefaultChild(): ChildConfig | undefined {
  return getChildren()[0];
}

export function getCanvasDomain(): string {
  return process.env.CANVAS_DOMAIN || "school.instructure.com";
}
