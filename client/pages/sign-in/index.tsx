import React from "react";
import Image from "next/image";
import { useStateContext } from "../../context/ThirdWebWrapper";
import { ChainId } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import SigninPageLayout from "../register/layout";
import { LoaderIcon } from "lucide-react";
import { useConnectionStatus } from "@thirdweb-dev/react";
import { NextPage } from "next";

enum USER_TYPE {
  DOCTOR = "doctor",
  PATIENT = "patient",
}

const SignInPage: NextPage = () => {
  const { connect, address, contract, exist, setExist } = useStateContext();
  const [addressLoading, setAddressLoading] = React.useState<boolean>(false);
  const connectionStatus = useConnectionStatus();
  const router = useRouter();

  const navigateToSignPage = async () => {
    if (exist === undefined) {
      const data = await contract!.call("doctorExist", [address]);
      const pdata = await contract!.call("patientExist", [address]);
      setExist(Boolean(data.exist ^ pdata.exist));
    }
  };

  React.useEffect(() => {
    address === undefined || contract === undefined ? "" : navigateToSignPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, contract]);

  React.useEffect(() => {
    exist === true
      ? router.push("/")
      : exist === false
      ? router.push("/register")
      : "";
  }, [exist, router]);

  React.useEffect(() => {
    address === undefined ? setExist(undefined) : "";
  }, [address, setExist]);

  React.useEffect(() => {
    connectionStatus === "connected" ? router.push("/") : "";
  }, [connectionStatus, router]);

  if (address === undefined) {
    return (
      <SigninPageLayout>
        <div className="h-screen flex-col gap-y-20 overflow-hidden flex justify-center items-center">
          <h1 className="sm:text-7xl text-5xl text-center -mt-40">
            <span className="bg-gradient-to-tr  antialiased from-red-300 font-bold  to-pink-900 text-transparent bg-clip-text">
              Welcome{" "}
            </span>
            Again
          </h1>
          <button
            onClick={() => {
              connect({ chainId: ChainId.Goerli });
              setAddressLoading(true);
            }}
            className="bg-slate-900 transition hover:bg-blue-500/20 hover:border-blue-500 border border-neutral-400/20 rounded-xl w-[220px] flex flex-col justify-center py-2 items-center group cursor-pointer"
          >
            <Image
              src={"/images/wallet.png"}
              width={200}
              height={100}
              alt="loading..."
            />
            <span className="cursor-pointer px-1 py-1 m-2 rounded border-neutral-400/40 text-xs">
              {addressLoading ? (
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Connect to Wallet"
              )}
            </span>
          </button>
        </div>
      </SigninPageLayout>
    );
  }
  return (
    <div className="h-screen flex items-center justify-center overflow-hidden">
      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
    </div>
  );
};

export default SignInPage;
