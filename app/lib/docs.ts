import fs from "fs";
import path from "path";
import matter from "gray-matter";

const docsDir = path.join(process.cwd(), "content/docs");

export type DocMeta = {
  slug: string;
  title: string;
  content: string;
};

export function getAllDocs(): DocMeta[] {
  if (!fs.existsSync(docsDir)) return [];
  const files = fs.readdirSync(docsDir).filter(f => f.endsWith(".md"));
  return files.map(f => {
    const slug = f.replace(/\.md$/, "");
    const source = fs.readFileSync(path.join(docsDir, f), "utf-8");
    const { content } = matter(source);
    const title = content.split("\n")[0]?.replace(/^#\s*/, "") || slug;
    return { slug, title, content };
  });
}

export function getDoc(slug: string): DocMeta | null {
  try {
    const filePath = path.join(docsDir, `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;
    const source = fs.readFileSync(filePath, "utf-8");
    const { content } = matter(source);
    const title = content.split("\n")[0]?.replace(/^#\s*/, "") || slug;
    return { slug, title, content };
  } catch {
    return null;
  }
}

export function getDocsContext(): string {
  const docs = getAllDocs();
  return docs.map(d => d.content).join("\n\n---\n\n");
}
