import React from "react";
import Navbar from "./navbar";
import Image from "next/image";
import { useStateContext } from "../context/ThirdWebWrapper";
import PatientListComponent from "./patientListComponent";
import RevokePatienceComponent from "./revokePatienceComponent";

/**
 * Interface representing user data.
 * @interface
 * @property {string} name - User's name.
 * @property {string} age - User's age.
 * @property {string} type - User's type (e.g., patient).
 * @property {string[]} accessList - List of users' access information.
 */
interface UserData {
  name: string;
  age: string;
  type: string;
  accessList: string[];
}

/**
 * Patient component for displaying patient-specific information.
 * @function
 */
const Patient = () => {
  const { address, contract, exist, setName } = useStateContext();
  const [user, setUser] = React.useState<UserData | null>(null);
  const [doctors, setAllDoctors] = React.useState<string[] | null>(null);

  React.useEffect(() => {
    /**
     * Function to fetch patient information from the smart contract.
     */
    const PatientInfo = async () => {
      const preparingContract = await contract!.call("getPatientInfo", [
        address,
      ]);
      setUser({
        name: preparingContract[0].toString(),
        age: preparingContract[1].toString(),
        type: preparingContract[2].toString(),
        accessList: preparingContract[3],
      });
      setName(preparingContract[0].toString());
      const data = await contract!.call("getALlDoctorList");
      if (data[0]) {
        setAllDoctors(data);
      }
    };

    exist && contract !== undefined ? PatientInfo() : "";
  }, [exist, contract, address, setName]);

  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar address={address!} />
      <div className="flex container lg:flex-row flex-col py-4 mt-10">
        <div>
          <Image
            src={"/images/patient.png"}
            width={800}
            height={500}
            alt="loading"
            priority
          />
        </div>
        <div className="border  w-full flex flex-col gap-y-4 rounded border-neutral-200/10">
          <div className="p-3 flex flex-col gap-y-4">
            <div>
              <span className="bg-blue-500/10 border px-2 py-1 rounded-full text-sm border-blue-500">
                Patient Name
              </span>{" "}
              : {user?.name}
            </div>
            <div>
              <span className="bg-blue-500/10 border px-2 py-1 rounded-full text-sm border-blue-500">
                Patient Age
              </span>{" "}
              : {user?.age}
            </div>
          </div>
          <div className="h-full border min-h-[400px] relative border-neutral-400/10 text-neutral-400/50">
            {doctors ? (
              doctors.map((item, _index) => {
                return <PatientListComponent key={_index} address={item} />;
              })
            ) : (
              <>
                <div className=" flex  h-[400px] justify-center items-center relative">
                  <Image
                    width={200}
                    height={500}
                    src={"/images/notloaded.png"}
                    className=" z-[-1]  absolute"
                    alt="loading.."
                    priority
                  />
                  <span className="mt-60">No Doctor</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="container mb-10  min-h-[200px]">
        <div className="border relative text-neutral-400/50 border-neutral-400/20 min-h-[600px]">
          {user?.accessList ? (
            user?.accessList.map((item, _index) => {
              return <RevokePatienceComponent key={_index} address={item} />;
            })
          ) : (
            <div className=" flex  h-[600px] justify-center items-center relative">
              <Image
                width={200}
                height={500}
                src={"/images/notloaded.png"}
                className=" z-[-1]  absolute"
                alt="loading.."
                priority
              />
              <span className="mt-60">No Information Shared</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Patient;
