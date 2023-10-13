import dynamic from "next/dynamic";
import { NextPage } from "next";
import { useStateContext } from "../context/ThirdWebWrapper";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useConnectionStatus } from "@thirdweb-dev/react";
const Patient = dynamic(()=>import("../components/patient"));
const Doctor = dynamic(()=>import("../components/doctor"));
import { LoaderIcon } from "lucide-react";

/**
 * Represents user data from the blockchain.
 * @interface
 * @property {string} name - The user's name.
 * @property {string} age - The user's age.
 * @property {string} type - The user's type (doctor or patient).
 * @property {string[]} accessList - List of user's access permissions.
 */
interface UserData {
  name: string;
  age: string;
  type: string;
  accessList: string[];
}

/**
 * Enum for user types.
 * @enum {string}
 */
enum USER_TYPE {
  DOCTOR = "doctor",
  PATIENT = "patient",
}

/**
 * The Home component for the web application.
 * @type {NextPage}
 */
const Home: NextPage = () => {
  // Access the context from the ThirdWebWrapper component.
  const { address, contract, exist, setExist } = useStateContext();
  const router = useRouter();
  const connectionStatus = useConnectionStatus();
  const [userType, setUserType] = useState<USER_TYPE>(USER_TYPE.DOCTOR);

  /**
   * Navigates to the sign-in page based on user data from the smart contract.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navigateToSignPage = async () => {
    const data = await contract!.call("doctorExist", [address]);
    const pdata = await contract!.call("patientExist", [address]);

    if (Boolean(data.exist) === true) {
      setUserType(data.user);
    } else if (Boolean(pdata.exist) === true) {
      setUserType(pdata.user);
    }
    setExist(Boolean(data.exist ^ pdata.exist));
  };

  useEffect(() => {
    // Navigate to the sign-in page if address or contract is undefined.
    address === undefined || contract === undefined ? "" : navigateToSignPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, contract]);

  useEffect(() => {
    // Redirect to the sign-in page if the connection status is "disconnected".
    connectionStatus === "disconnected" ? router.push("/sign-in") : "";
  }, [connectionStatus, router]);

  useEffect(() => {
    // Redirect to the registration page if exist is false and the contract is available.
    exist === false ? router.push("/register") : "";
  }, [exist, contract, router]);

  if (exist === true && address) {
    return <div>{userType === "patient" ? <Patient /> : <Doctor />}</div>;
  }

  return (
    <div className="h-screen flex items-center justify-center overflow-hidden">
      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
    </div>
  );
};

export default Home;
