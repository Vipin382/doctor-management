import React from "react";
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
  MetaMaskWallet,
} from "@thirdweb-dev/react";
import {
  IGenerateReport,
  IRegisterPatient,
  IThirdWebWrapperContext,
} from "../types";
import { toast } from "sonner";

/**
 * Defines the context for the ThirdWebWrapper component.
 * This context provides functions and values related to interacting with the blockchain.
 * @type {React.Context<IThirdWebWrapperContext>}
 */
const ThirdWebWrapperContext = React.createContext<IThirdWebWrapperContext>({
  connect: function (
    connectOptions?: { chainId?: number | undefined } | undefined
  ): Promise<MetaMaskWallet> {
    throw new Error("Function not implemented.");
  },
  address: undefined,
  RegisterUserAsPatient: function ({
    _name,
    age,
  }: IRegisterPatient): Promise<void> {
    throw new Error("Function not implemented.");
  },
  contract: undefined,
  RegisterUserAsDoctor: function ({
    _name,
    age,
  }: IRegisterPatient): Promise<void> {
    throw new Error("Function not implemented.");
  },
  exist: undefined,
  setExist: function (value: React.SetStateAction<boolean | undefined>): void {
    throw new Error("Function not implemented.");
  },
  ProvideAccess: function ({
    owner,
    _id,
  }: {
    owner: string;
    _id: string;
  }): Promise<void> {
    throw new Error("Function not implemented.");
  },
  RevokeAccess: function ({
    owner,
    _id,
  }: {
    owner: string;
    _id: string;
  }): Promise<void> {
    throw new Error("Function not implemented.");
  },
  GenerateReport: function (props: IGenerateReport): Promise<void> {
    throw new Error("Function not implemented.");
  },
  name: null,
  setName: function (value: React.SetStateAction<string | null>): void {
    throw new Error("Function not implemented.");
  },
});

/**
 * Props for the ThirdWebWrapper component.
 * @interface IThirdWebWrapper
 * @property {React.ReactNode} children - The child components to be wrapped by ThirdWebWrapper.
 */
interface IThirdWebWrapper {
  children: React.ReactNode;
}

/**
 * A React component that provides a context for interacting with blockchain smart contracts.
 * It includes functions for registering patients and doctors, providing and revoking access,
 * and generating reports.
 * @param {IThirdWebWrapper} props - The component's props.
 */
const ThirdWebWrapper = ({ children }: IThirdWebWrapper) => {
  // Fetch the smart contract using the provided address
  const { contract } = useContract(
    "0xE95c0C4185871a0a8A13a49B3a02Eb97d6CBFF8B"
  );
  const [exist, setExist] = React.useState<boolean | undefined>();
  const [name, setName] = React.useState<string | null>(null);
  // Create contract write functions for various actions
  const { mutateAsync: registerPatient, isLoading } = useContractWrite(
    contract,
    "registerPatient"
  );
  const { mutateAsync: registerDoctor, isLoading: isDoctorLoading } =
    useContractWrite(contract, "registerDoctor");
  const { mutateAsync: provideAccess, isLoading: provideLoading } =
    useContractWrite(contract, "provideAccess");
  const { mutateAsync: revokeAccess, isLoading: RevokeLoading } =
    useContractWrite(contract, "revokeAccess");
  const address = useAddress();
  const connect = useMetamask();

  /**
   * Registers a user as a patient in the smart contract.
   * @param {IRegisterPatient} _name - The patient's name and age.
   */
  const RegisterUserAsPatient = async ({ _name, age }: IRegisterPatient) => {
    try {
      const data = await registerPatient({ args: [_name, parseInt(age)] });
      toast.success("User has been successfully registered as a patient");
    } catch (err) {
      toast.error("User Already Exist");
    }
  };

  /**
   * Registers a user as a doctor in the smart contract.
   * @param {IRegisterPatient} _name - The doctor's name and age.
   */
  const RegisterUserAsDoctor = async ({ _name, age }: IRegisterPatient) => {
    try {
      const data = await registerDoctor({ args: [_name, age] });
      toast.success("User has been successfully registered as a Doctor");
    } catch (err) {
      toast.error("User Already Exist");
    }
  };

  /**
   * Provides access to user data for a specific user.
   * @param {object} params - The owner and ID for granting access.
   * @param {string} params.owner - The owner's address.
   * @param {string} params._id - The user ID.
   */
  const ProvideAccess = async ({
    owner,
    _id,
  }: {
    owner: string;
    _id: string;
  }) => {
    try {
      const data = await provideAccess({ args: [owner, _id] });
      toast.success(`${_id} assigned access to user data`);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  /**
   * Revokes access to user data for a specific user.
   * @param {object} params - The owner and ID for revoking access.
   * @param {string} params.owner - The owner's address.
   * @param {string} params._id - The user ID.
   */
  const RevokeAccess = async ({
    owner,
    _id,
  }: {
    owner: string;
    _id: string;
  }) => {
    try {
      const data = await revokeAccess({ args: [owner, _id] });
      toast.success("Permission has been successfully revoked");
    } catch (err) {
      toast.error("Something Went Wrong");
    }
  };

  // Create a contract write function for generating a report
  const { mutateAsync: generatingReport, isLoading: GenerateLoading } =
    useContractWrite(contract, "generatingReport");

  /**
   * Generates a report for a user.
   * @param {IGenerateReport} props - The report details.
   */
  const GenerateReport = async (props: IGenerateReport) => {
    try {
      const data = await generatingReport({
        args: [
          props._id,
          props.owner,
          props.name,
          props._doctor,
          props._report,
          props.date_of_report,
        ],
      });
      toast.success("Generated Report");
    } catch (err) {
      toast.error("Something Went Wrong");
    }
  };

  return (
    <ThirdWebWrapperContext.Provider
      value={{
        connect,
        address,
        RegisterUserAsPatient,
        contract,
        RegisterUserAsDoctor,
        exist,
        setExist,
        ProvideAccess,
        RevokeAccess,
        GenerateReport,
        name,
        setName,
      }}
    >
      {children}
    </ThirdWebWrapperContext.Provider>
  );
};

export default ThirdWebWrapper;

/**
 * Custom hook for accessing the ThirdWebWrapper context.
 * @returns {IThirdWebWrapperContext} The ThirdWebWrapper context.
 */
export const useStateContext = () => React.useContext(ThirdWebWrapperContext);
