import React from "react";
import Image from "next/image";
import { useStateContext } from "../../context/ThirdWebWrapper";
import { ChainId } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import SigninPageLayout from "./layout";
import { LoaderIcon } from "lucide-react";
import { useConnectionStatus } from "@thirdweb-dev/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { useForm } from "react-hook-form";
import { Separator } from "../../components/ui/separator";
import { NextPage } from "next";

/**
 * Enum for user types.
 * @enum {string}
 */
enum USER_TYPE {
  DOCTOR = "doctor",
  PATIENT = "patient",
}

/**
 * Represents the schema for patient registration form validation.
 * @type {z.ZodObject}
 * @variable {z.ZodObject} patientSchema - Schema for patient registration.
 */
const patientSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  age: z.string(),
});

/**
 * Represents the schema for doctor registration form validation.
 * @type {z.ZodObject}
 * @variable {z.ZodObject} doctorSchema - Schema for doctor registration.
 */
const doctorSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  age: z.string(),
});

/**
 * The RegisterPage component for user registration.
 * @function
 * @component
 */
const RegisterPage: NextPage = () => {
  // Access the context from the ThirdWebWrapper component.
  const {
    connect,
    address,
    RegisterUserAsPatient,
    exist,
    RegisterUserAsDoctor,
  } = useStateContext();
  const [doctor, setDoctor] = React.useState<USER_TYPE | undefined>(undefined);
  const [userLoading, setUserLoading] = React.useState<boolean>(false);
  const [doctorLoading, setDoctorLoading] = React.useState<boolean>(false);
  const router = useRouter();

  // Create a form using React Hook Form and patientSchema.
  const form = useForm<z.infer<typeof patientSchema>>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      username: "",
      age: "",
    },
  });

  // Create a form using React Hook Form and doctorSchema.
  const doctorform = useForm<z.infer<typeof doctorSchema>>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      username: "",
      age: "",
    },
  });

  React.useEffect(() => {
    // Redirect to the home page if exist is true, to registration page if false, or do nothing if undefined.
    exist === true
      ? router.push("/")
      : exist === false
      ? router.push("/register")
      : "";
  }, [exist, router]);

  // Define a submit handler for patient registration.
  async function onSubmit(values: z.infer<typeof patientSchema>) {
    setDoctorLoading(true);
    console.log(values);
    await RegisterUserAsDoctor({ _name: values.username, age: values.age });
    setDoctorLoading(false);
    router.push("/sign-in");
    form.reset();
  }

  // Define a submit handler for doctor registration.
  async function onDoctorSubmit(values: z.infer<typeof doctorSchema>) {
    setUserLoading(true);
    console.log(values);
    await RegisterUserAsPatient({ _name: values.username, age: values.age });
    setUserLoading(false);
    router.push("/sign-in");
    doctorform.reset();
  }

  if (!address) {
    return (
      <SigninPageLayout>
        <div className="h-screen overflow-hidden flex justify-center items-center">
          <button
            onClick={() => connect({ chainId: ChainId.Goerli })}
            className="bg-slate-900 transition hover-bg-blue-500/20 hover-border-blue-500 border border-neutral-400/20 rounded-xl w-[220px] flex flex-col justify-center py-2 items-center group cursor-pointer"
          >
            <Image
              src={"/images/wallet.png"}
              width={200}
              height={100}
              alt="loading..."
            />
            <span className="cursor-pointer px-1 py-1 m-2 rounded border-neutral-400/40 text-xs">
              Connect to Wallet
            </span>
          </button>
        </div>
      </SigninPageLayout>
    );
  }

  if (doctor === undefined) {
    return (
      <SigninPageLayout>
        <div className="h-screen overflow-hidden flex-col flex justify-center items-center">
          <div className="w-[240px]">
            <Button
              onClick={() => setDoctor(USER_TYPE.DOCTOR)}
              className="w-full border bg-slate-900 hover-bg-slate-800/80 border-neutral-400/20"
            >
              Doctor
            </Button>
            <Separator className="my-2 bg-neutral-500/20" />
            <Button
              onClick={() => setDoctor(USER_TYPE.PATIENT)}
              className="w-full border bg-slate-900 border-neutral-400/20"
            >
              Patient
            </Button>
          </div>
        </div>
      </SigninPageLayout>
    );
  }

  if (doctor === USER_TYPE.PATIENT) {
    return (
      <SigninPageLayout>
        <div className="h-screen overflow-hidden flex-col flex justify-center items-center">
          <div className="flex flex-col gap-y-4 max-w-[600px] w-[90%]">
            <h1 className="text-4xl text-zinc-300 font-medium">
              Register as Patient
            </h1>
            <Form {...form}>
              <form
                onSubmit={doctorform.handleSubmit(onDoctorSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={doctorform.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl className="h-8 focus-visible-border-none border-neutral-500/10 focus-visible-outline-none focus-visible-ring-0 placeholder-text-neutral-300/20 focus-visible-bg-slate-900/80 focus-visible-ring-offset-blue-500/50 text-xs bg-slate-900 rounded">
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={doctorform.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl className="h-8 focus-visible-border-none border-neutral-500/10 focus-visible-outline-none focus-visible-ring-0 placeholder-text-neutral-300/20 focus-visible-bg-slate-900/80 focus-visible-ring-offset-blue-500/50 text-xs bg-slate-900 rounded">
                        <Input placeholder="Age" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex space-x-4">
                  <Button
                    className="bg-gradient-to-tr from-red-400 to-pink-500 hover-bg-red-500/80 transition cursor-pointer h-8 text-xs rounded border border-red-600/20"
                    type="submit"
                  >
                    {userLoading ? (
                      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      doctorform.reset();
                      setDoctor(undefined);
                    }}
                    className="bg-gradient-to-tr from-red-400 to-pink-500 hover-bg-red-500/80 transition cursor-pointer h-8 text-xs rounded border border-red-600/20"
                  >
                    Back
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </SigninPageLayout>
    );
  }

  if (doctor === USER_TYPE.DOCTOR) {
    return (
      <SigninPageLayout>
        <div className="h-screen overflow-hidden flex-col flex justify-center items-center">
          <div className="flex flex-col gap-y-4 max-w-[600px] w-[90%]">
            <h1 className="text-4xl text-zinc-300 font-medium">
              Register as Doctor
            </h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl className="h-8 focus-visible-border-none border-neutral-500/10 focus-visible-outline-none focus-visible-ring-0 placeholder-text-neutral-300/20 focus-visible-bg-slate-900/80 focus-visible-ring-offset-blue-500/50 text-xs bg-slate-900 rounded">
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl className="h-8 focus-visible-border-none border-neutral-500/10 focus-visible-outline-none focus-visible-ring-0 placeholder-text-neutral-300/20 focus-visible-bg-slate-900/80 focus-visible-ring-offset-blue-500/50 text-xs bg-slate-900 rounded">
                        <Input placeholder="age" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex space-x-4">
                  <Button
                    className="bg-gradient-to-tr from-red-400 to-pink-500 hover-bg-red-500/80 transition cursor-pointer h-8 text-xs rounded border border-red-600/20"
                    type="submit"
                  >
                    {doctorLoading ? (
                      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      form.reset();
                      setDoctor(undefined);
                    }}
                    className="bg-gradient-to-tr from-red-400 to-pink-500 hover-bg-red-500/80 transition cursor-pointer h-8 text-xs rounded border border-red-600/20"
                  >
                    Back
                  </Button>
                </div>
              </form>
            </Form>
          </div>
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

export default RegisterPage;
