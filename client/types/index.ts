import { MetaMaskWallet, SmartContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";

/**
 * Interface for registering a patient.
 * @interface
 * @property {string} _name - The name of the patient.
 * @property {string} age - The age of the patient.
 */
export interface IRegisterPatient {
  _name: string;
  age: string;
}

/**
 * Interface for generating a report.
 * @interface
 * @property {string} _id - The ID of the report.
 * @property {string} owner - The owner of the report.
 * @property {string} name - The name associated with the report.
 * @property {string} _doctor - The doctor associated with the report.
 * @property {string} _report - The content of the report.
 * @property {string} date_of_report - The date of the report.
 */
export interface IGenerateReport {
  _id: string;
  owner: string;
  name: string;
  _doctor: string;
  _report: string;
  date_of_report: string;
}

/**
 * Interface for the context provided by ThirdWebWrapper.
 * @interface
 */
export interface IThirdWebWrapperContext {
  /**
   * Connect to the wallet.
   * @function
   * @params {connectOptions} connectOptions - Optional connection options.
   * @returns {Promise<MetaMaskWallet>} A promise that resolves to a MetaMaskWallet.
   */
  connect: (
    connectOptions?:
      | {
          chainId?: number | undefined;
        }
      | undefined
  ) => Promise<MetaMaskWallet>;

  /**
   * The user's address.
   * @property
   */
  address: string | undefined;

  /**
   * Register a user as a patient.
   * @function
   * @params {_name} _name - The name of the patient.
   * @params {age} age - The age of the patient.
   * @returns {Promise<void>} A promise that resolves when the user is registered.
   */
  RegisterUserAsPatient: ({ _name, age }: IRegisterPatient) => Promise<void>;

  /**
   * Register a user as a doctor.
   * @function
   * @params {_name} _name - The name of the doctor.
   * @params {age} age - The age of the doctor.
   * @returns {Promise<void>} A promise that resolves when the user is registered.
   */
  RegisterUserAsDoctor: ({ _name, age }: IRegisterPatient) => Promise<void>;

  /**
   * The smart contract instance.
   * @property
   */
  contract: SmartContract<ethers.BaseContract> | undefined;

  /**
   * Indicates whether the user exists.
   * @property
   */
  exist: boolean | undefined;

  /**
   * Set the existence state.
   * @function
   * @params {value} value - The new existence state.
   */
  setExist: React.Dispatch<React.SetStateAction<boolean | undefined>>;

  /**
   * Generate a medical report.
   * @function
   * @params {props} props - The report details.
   * @returns {Promise<void>} A promise that resolves when the report is generated.
   */
  GenerateReport: (props: IGenerateReport) => Promise<void>;

  /**
   * The user's name.
   * @property
   */
  name: string | null;

  /**
   * Set the user's name.
   * @function
   * @params {value} value - The new user name.
   */
  setName: React.Dispatch<React.SetStateAction<string | null>>;

  /**
   * Provide access to user data.
   * @function
   * @params {owner} owner - The owner of the data.
   * @params {_id} _id - The data identifier.
   * @returns {Promise<void>} A promise that resolves when access is granted.
   */
  ProvideAccess: ({
    owner,
    _id,
  }: {
    owner: string;
    _id: string;
  }) => Promise<void>;

  /**
   * Revoke access to user data.
   * @function
   * @params {owner} owner - The owner of the data.
   * @params {_id} _id - The data identifier.
   * @returns {Promise<void>} A promise that resolves when access is revoked.
   */
  RevokeAccess: ({
    owner,
    _id,
  }: {
    owner: string;
    _id: string;
  }) => Promise<void>;
}
