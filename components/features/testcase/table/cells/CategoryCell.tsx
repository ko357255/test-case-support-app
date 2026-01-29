export default function CategoryCell({ category }: { category: string }) {
  return (
    <td className="px-6 py-4">
      <span className="bg-muted text-muted-foreground inline-flex rounded px-2 py-2 text-xs font-medium whitespace-nowrap">
        {category}
      </span>
    </td>
  );
}
