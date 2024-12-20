import { Tv } from "lucide-react";

const NavLogo = () => {
  return (
    <div className="flex items-end gap-2">
      <Tv className="w-10 h-10 text-blue-600" strokeWidth={2} />
      <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-blue-500/50 text-transparent bg-clip-text uppercase">
        AnimeZone
      </span>
    </div>
  );
};

export default NavLogo;
