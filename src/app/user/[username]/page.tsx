import Header from "@/components/ui/Header";
import styles from "./page.module.css";
import AccountSidebar from "@/components/ui/AccountSidebar";

interface UserPageProps {
  params: { username: string };
}

export default function UserPage({ params }: UserPageProps) {
  const { username } = params;
  return (
    <div className="page">
      <Header />
      <main className={styles.userProfile}>
        <AccountSidebar />
        <div className={styles.avatarDisplay}>
          <div className="avatar avatar-placeholder">
            <div className="bg-neutral text-neutral-content w-24 rounded-full">
              <span className="text-3xl">D</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
