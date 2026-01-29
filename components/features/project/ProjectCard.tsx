import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { NestedProject } from '@/types/testcase';

interface Props {
  project: NestedProject;
}

export default function ProjectCard({ project }: Props) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group border-border bg-card hover:border-primary flex flex-col items-start rounded-2xl border p-8 text-left transition-all hover:shadow-lg"
    >
      <h3 className="group-hover:text-primary pb-1 text-xl font-bold transition-colors">
        {project.name}
      </h3>

      <div className="border-border text-muted-foreground mt-auto flex w-full items-center justify-between border-t pt-6 text-sm font-bold tracking-widest uppercase">
        <div className="flex flex-col gap-1">
          <span>{project.testCases?.length || 0} ケース</span>
        </div>
        <ChevronRight
          size={20}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
