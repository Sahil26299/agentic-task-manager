export function generateUrlSlug(title: string, id?: string | number): string {
    if (!title) return "";

    // Convert to lowercase, remove special characters, replace spaces with hyphens
    const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")  // remove non-word chars
        .replace(/\s+/g, "-");     // replace spaces with '-'

    // Append ID if provided
    return id ? `${slug}/${id}` : slug;
}

//convert dash separated slug to string and to retrieve id
export function parseSlug(slug: string) {
    const parts = slug.split("/");
    const id = parts.pop();
    const title = parts.join(" ").replace(/-/g, " ");
    return { title, id };
}