import Cookies from "js-cookie";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";

interface UserAvatarProps {
  name?: string;
}

function UserAvatar({ name = "John Doe" }: UserAvatarProps) {
  const role = Cookies.get("portal.role");
  return (
    <div className="flex align-items-center gap-3">
      <Avatar
        className="cursor-pointer p-overlay-badge"
        label={name.charAt(0)}
        size="large"
        shape="square"
        style={{
          width: "1.75rem",
          height: "1.75rem",
          background: "var(--cor-destaque)",
        }}
      >
        {role === "ROLE_ADMIN" && (
          <Badge style={{ scale: "0.7" }} value="ADMIN" severity="danger" />
        )}
      </Avatar>
      <span className="text-xl">{name}</span>
    </div>
  );
}

export default UserAvatar;
