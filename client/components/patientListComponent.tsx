import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useStateContext } from "../context/ThirdWebWrapper";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/router";

/**
 * Props for the PatientListComponent.
 * @interface
 * @property {string} address - The address of the patient.
 */
type Props = {
  address: string;
};

/**
 * PatientListComponent is used to display a patient and provide access.
 * @function
 */
const PatientListComponent = (props: Props) => {
  const { address, ProvideAccess } = useStateContext();
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();

  /**
   * Handles providing access to a patient.
   * @function
   * @param {Object} values - Object containing owner and _id.
   * @param {string} values.owner - The owner's address.
   * @param {string} values._id - The patient's ID.
   */
  const HandleAccess = async (values: { owner: string; _id: string }) => {
    setLoading(true);
    await ProvideAccess(values);
    setLoading(false);
    router.reload();
  };

  return (
    <div className="border cursor-pointer hover:bg-neutral-400/10 transition w-full text-xs flex justify-between items-center px-2 py-1.5 border-neutral-400/20">
      <div className="flex items-center gap-x-2">
        <FaUserCircle size={40} />
        {props.address}
      </div>
      <button
        onClick={() => HandleAccess({ owner: address!, _id: props.address })}
        className="border px-1 rounded bg-green-500 text-white transition hover:shadow-sm hover:shadow-green-500 cursor-pointer text-xs h-6 border-neutral-400/20"
      >
        {loading ? (
          <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Give access"
        )}
      </button>
    </div>
  );
};

export default PatientListComponent;
