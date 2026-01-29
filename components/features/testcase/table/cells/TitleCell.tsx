export default function TitleCell({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <td className="px-6 py-4">
      <div className="text-foreground text-sm">{title}</div>
      <div className="text-muted-foreground mt-1 line-clamp-1 text-sm">
        {description}
      </div>
    </td>
  );
}
