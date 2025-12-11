export default function CategoryCell({ category }: { category: string }) {
  return (
    <td className="px-6 py-4">
      <span className="inline-flex rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
        {category}
      </span>
    </td>
  );
}
