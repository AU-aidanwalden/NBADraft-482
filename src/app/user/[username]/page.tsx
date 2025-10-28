import Header from "@/components/ui/Header";
import AccountSidebar from "@/components/ui/AccountSidebar";

interface UserPageProps {
  params: { username: string };
}

export default function UserPage({ params }: UserPageProps) {
  const { username } = params;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex gap-8 p-8">
        <AccountSidebar />

        <div className="flex flex-col items-center justify-center flex-1">
          <div className="avatar mb-4">
            <div className="bg-neutral text-neutral-content w-24 h-24 flex items-center justify-center rounded-full">
              <span className="text-3xl font-bold">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            {username}
          </h2>
        </div>
      </main>
    </div>
  );
}
