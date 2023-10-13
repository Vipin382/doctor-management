import React from "react";
import Navbar from "./navbar";
import Image from "next/image";
import { useStateContext } from "../context/ThirdWebWrapper";
import DoctorListComponent from "./doctorListComponent";
import ViewReportComponent from "./viewReportComponent";

/**
 * Interface representing user data.
 * @interface
 * @property {string} name - The name of the user.
 * @property {string} age - The age of the user.
 * @property {string} type - The user type.
 * @property {string[]} patientAccessList - List of patient access addresses.
 */
interface UserData {
  name: string;
  age: string;
  type: string;
  patientAccessList: string[];
}

/**
 * Component for displaying doctor information.
 * @function
 */
const Doctor = () => {
  const { address, contract, exist, setExist, setName } = useStateContext();
  const [user, setUser] = React.useState<UserData | null>(null);

  React.useEffect(() => {
    const fetchDoctorInfo = async () => {
      const preparingContract = await contract!.call("getDoctorDetails", [
        address,
      ]);
      setUser({
        name: preparingContract[0].toString(),
        age: preparingContract[1].toString(),
        type: preparingContract[2].toString(),
        patientAccessList: preparingContract[3],
      });
      setName(preparingContract[0].toString());
    };
    exist && contract !== undefined ? fetchDoctorInfo() : "";
  }, [exist, contract, address, setName]);

  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar address={address!} />
      <div className="flex container lg:flex-row flex-col py-4 mt-10">
        <div>
          <Image
            src={"/images/doctor.png"}
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
                Doctor Name
              </span>{" "}
              : {user?.name}
            </div>
            <div>
              <span className="bg-blue-500/10 border px-2 py-1 rounded-full text-sm border-blue-500">
                Doctor Age
              </span>{" "}
              : {user?.age}
            </div>
          </div>
          <div className="h-full border min-h-[400px] relative border-neutral-400/10 flex justify-center text-neutral-400/50">
            {user?.patientAccessList ? (
              user?.patientAccessList.map((item, _index) => {
                return <DoctorListComponent key={_index} address={item} />;
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
          {user?.patientAccessList ? (
            user?.patientAccessList.map((item, _index) => {
              return <ViewReportComponent key={_index} address={item} />;
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

export default Doctor;
