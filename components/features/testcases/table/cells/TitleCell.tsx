export default function TitleCell({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <td className="px-6 py-4">
      <div className="text-sm text-gray-900">{title}</div>
      <div className="mt-1 line-clamp-1 text-sm text-gray-500">
        {description}
      </div>
    </td>
  );
}
