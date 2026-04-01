import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import type { User } from "@/types/api";

const UserAvatar = ({ name, imageUrl }: Pick<User, "name" | "imageUrl">) => {
  return (
    <Avatar>
      <AvatarImage src={imageUrl} />
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
