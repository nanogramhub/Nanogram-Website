import { useAuthStore } from "@/store/use-auth-store";

const UserProfile = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  if (!currentUser) return null;
  return (
    <div className="flex lg:flex-row flex-col lg:items-center items-start lg:gap-4 gap-1 w-full py-2">
      <img
        src={currentUser.imageUrl}
        alt={"usrimg"}
        className="size-10 lg:size-20 rounded-full"
      />
      <table className="w-full">
        <colgroup>
          <col style={{ width: "30%" }} />
          <col style={{ width: "70%" }} />
        </colgroup>
        <tbody>
          <tr>
            <td className="text-muted-foreground align-text-top">Name</td>
            <td className="text-xs ml-2">{currentUser.name}</td>
          </tr>
          <tr>
            <td className="text-muted-foreground align-text-top">Userame</td>
            <td className="text-xs font-light ml-2">{currentUser.username}</td>
          </tr>
          <tr>
            <td className="text-muted-foreground align-text-top">Email</td>
            <td className="text-xs font-light ml-2">{currentUser.email}</td>
          </tr>
          <tr>
            <td className="text-muted-foreground align-text-top">Bio</td>
            <td className="text-xs font-light ml-2">{currentUser.bio}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserProfile;
