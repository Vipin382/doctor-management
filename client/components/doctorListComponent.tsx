import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useStateContext } from "../context/ThirdWebWrapper";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useModelProvider } from "../context/ModelProvider";

/**
 * Props for the DoctorListComponent component.
 * @interface
 * @property {string} address - The address of the patient.
 */
type Props = {
  address: string;
};

/**
 * Interface representing user data.
 * @interface
 * @property {string} name - The name of the user.
 * @property {string} age - The age of the user.
 */
interface UserData {
  name: string;
  age: string;
}

/**
 * Component for displaying a list of doctors.
 * @function
 */
const DoctorListComponent = (props: Props) => {
  const { contract } = useStateContext();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [Revokeloading, setRevokeLoading] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<UserData | null>(null);
  const { address, RevokeAccess } = useStateContext();
  const { setOpen } = useModelProvider();
  const router = useRouter();

  /**
   * Handles the revocation of patient access.
   * @function
   * @param {object} values - Access information to revoke.
   */
  const HandleAccess = async (values: { owner: string; _id: string }) => {
    setRevokeLoading(true);
    await RevokeAccess(values);
    setRevokeLoading(false);
    router.reload();
  };

  React.useEffect(() => {
    const fetchPatientInfo = async () => {
      const preparingContract = await contract!.call("getPatientInfo", [
        props.address,
      ]);
      setUser({
        name: preparingContract[0].toString(),
        age: preparingContract[1].toString(),
      });
    };
    props.address === undefined ? "" : fetchPatientInfo();
  }, [contract, props.address]);

  return (
    <div className="border h-14 cursor-pointer hover:bg-neutral-400/10 transition w-full text-xs flex justify-between items-center px-2 py-1.5 border-neutral-400/20">
      <div className="flex items-center gap-x-2">
        <FaUserCircle size={40} />

        {props.address}
      </div>
      <div className="flex gap-x-2">
        <button
          onClick={() => HandleAccess({ owner: address!, _id: props.address })}
          className="border px-1 rounded bg-red-500 text-white transition hover:shadow-sm hover:shadow-red-500 cursor-pointer text-xs h-6 border-neutral-400/20"
        >
          {Revokeloading ? (
            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Remove Patient"
          )}
        </button>
        <button
          onClick={() =>
            setOpen({
              open: true,
              address: props.address,
              age: user?.age!,
              name: user?.name!,
            })
          }
          className="border px-1 rounded bg-green-500 text-white transition hover:shadow-sm hover:shadow-green-500 cursor-pointer text-xs h-6 border-neutral-400/20"
        >
          {loading ? (
            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Generate Report"
          )}
        </button>
      </div>
    </div>
  );
};

export default DoctorListComponent;
