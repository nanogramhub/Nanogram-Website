import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import type { User } from "@/types/schema";
import type { AvatarRootProps } from "@base-ui/react";

type UserAvatarProps = AvatarRootProps &
  Pick<User, "name" | "imageUrl"> & {
    size?: "default" | "sm" | "lg";
  };

const UserAvatar = ({ name, imageUrl, size, ...props }: UserAvatarProps) => {
  return (
    <Avatar size={size} {...props}>
      <AvatarImage src={imageUrl} />
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
