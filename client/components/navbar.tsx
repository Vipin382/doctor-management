import React from "react";
import { useDisconnect } from "@thirdweb-dev/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdOutlineContentCopy } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "sonner";

/**
 * Props for the Navbar component.
 * @interface
 * @property {string} address - The user's wallet address.
 */
type Props = {
  address: string;
};

/**
 * Navbar component for displaying the navigation bar.
 * @function
 * @param {Props} props - The component's props.
 */
const Navbar = (props: Props) => {
  const disconnect = useDisconnect();

  return (
    <nav className="container flex h-[60px] justify-between py-2 w-full">
      <h1 className=" bg-gradient-to-tr antialiased text-transparent font-bold text-3xl from-red-200 to-pink-800 bg-clip-text">
        <span>H</span>ealer
      </h1>
      <DropdownMenu>
        <DropdownMenuTrigger className="text-neutral-400/50 rounded-full max-w-fit flex flex-col justify-center hover:border hover:bg-blue-500/20 hover:border-blue-500 text-xs">
          <FaUserCircle size={40} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black border mt-3 mr-1 border-neutral-400/20 text-neutral-400/80">
          <DropdownMenuItem className="cursor-pointer transition focus:text-neutral-400/80 hover:text-neutral-400/80 flex gap-x-2 focus:bg-neutral-300/10 hover:bg-neutral-300/10">
            {props.address}
            <CopyToClipboard text={props.address}>
              <button onClick={() => toast("copy to clipboard")}>
                <MdOutlineContentCopy />
              </button>
            </CopyToClipboard>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={disconnect}
            className="cursor-pointer transition focus:text-red-500 focus:bg-red-500/20 hover:bg-red-500/20 hover:text-red-500"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default Navbar;
