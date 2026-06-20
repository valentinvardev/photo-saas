import { ShareViewer } from "./viewer";

export const metadata = { title: "Shared · Portapic" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ShareViewer id={id} />;
}
