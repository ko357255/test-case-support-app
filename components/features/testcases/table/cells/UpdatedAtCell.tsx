export default function UpdatedAtCell({ date }: { date: string }) {
  return (
    <td className="text-muted-foreground px-6 py-4 text-sm">
      {new Date(date).toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })}
    </td>
  );
}
