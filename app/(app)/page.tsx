import { redirect } from 'next/navigation';

/**
 * ホーム（サーバー）
 */
export default async function Home() {
  redirect('/projects');
}
