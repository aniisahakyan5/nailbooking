import BookingsAdmin from "@/components/admin/BookingsAdmin";

export default async function BookingsPage({ params }: { params: Promise<{ lang: string }> }) {
  await params;

  return <BookingsAdmin />;
}
