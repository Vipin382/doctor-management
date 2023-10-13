import React, { useContext } from "react";
import { Dialog, DialogContent, DialogHeader } from "../components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { useStateContext } from "./ThirdWebWrapper";
import { Textarea } from "../components/ui/textarea";
import { LoaderIcon } from "lucide-react";

/**
 * Interface representing the structure of the modal dialog content.
 * @interface
 * @property {string} address - Address of the patient.
 * @property {string} name - Name of the patient.
 * @property {string} age - Age of the patient.
 * @property {boolean} open - Flag indicating if the dialog is open.
 */
interface IOpen {
  address: string;
  name: string;
  age: string;
  open: boolean;
}

/**
 * Interface representing the context for the modal dialog.
 * @interface
 * @property {IOpen} open - Structure representing the dialog state.
 * @property {React.Dispatch<React.SetStateAction<IOpen>>} setOpen - Function to set the dialog state.
 */
interface IModelContext {
  open: IOpen;
  setOpen: React.Dispatch<React.SetStateAction<IOpen>>;
}

/**
 * Context to manage the modal dialog state.
 * @const
 */
const ModelContext = React.createContext<IModelContext>({
  open: {
    address: "",
    open: false,
    name: "",
    age: "",
  },
  setOpen: function (value: React.SetStateAction<IOpen>): void {
    throw new Error("Function not implemented.");
  },
});

/**
 * Validation schema for the report form.
 * @const
 */
const formSchema = z.object({
  report: z.string().min(2, {
    message: "Report must be at least 2 characters.",
  }),
});

/**
 * Interface representing the props for ModelProvider component.
 * @interface
 * @property {React.ReactNode} children - Child components.
 */
interface IModelProvider {
  children: React.ReactNode;
}

/**
 * ModelProvider manages the state and functionality of the modal dialog.
 * @function
 */
const ModelProvider = ({ children }: IModelProvider) => {
  const [mount, setMount] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<IOpen>({
    address: "",
    open: false,
    name: "",
    age: "",
  });
  const { GenerateReport, address, name } = useStateContext();

  // Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      report: "",
    },
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    await GenerateReport({
      _id: open.address,
      owner: address!,
      name: open.name,
      _doctor: name!,
      _report: values.report,
      date_of_report: new Date().toLocaleString(),
    });
    setLoading(false);
    setOpen({
      open: false,
      address: open.address,
      age: open.age,
      name: open.name,
    });
  }

  React.useEffect(() => {
    setMount(true);
  }, [mount]);

  return (
    <ModelContext.Provider value={{ open, setOpen }}>
      {mount ? (
        <Dialog
          open={open.open}
          onOpenChange={(value) =>
            setOpen({
              open: value,
              address: open.address,
              age: "",
              name: "",
            })
          }
        >
          <DialogContent className="border-neutral-400/20 bg-neutral-900 border">
            <div className="h-14 w-full flex items-center justify-center">
              <div
                style={{
                  backgroundColor: "rgba(59,130,246,0.2)",
                  textTransform: "capitalize",
                }}
                className="border flex text-xs py-2 border-blue-500 justify-center items-center rounded w-full"
              >
                {open.address}
              </div>
            </div>
            <div className="flex gap-x-2 justify-between">
              <div
                style={{
                  backgroundColor: "rgba(59,130,246,0.2)",
                  textTransform: "capitalize",
                }}
                className="border flex border-blue-500 capitalize justify-center items-center rounded w-full"
              >
                {open.name}
              </div>
              <div
                style={{
                  backgroundColor: "rgba(59,130,246,0.2)",
                }}
                className="border flex border-blue-500 justify-center items-center rounded w-full"
              >
                {open.age}
              </div>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="report"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report</FormLabel>
                      <FormControl>
                        <Textarea
                          className="h-8 placeholder:text-neutral-700 bg-neutral-900 border border-neutral-400/10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none p-1 rounded"
                          placeholder="Type your Report here."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  className="text-xs cursor-pointer bg-red-500 h-8 hover:bg-red-300 transition"
                  type="submit"
                >
                  {loading ? (
                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      ) : (
        ""
      )}
      {children}
    </ModelContext.Provider>
  );
};

export default ModelProvider;

export const useModelProvider = () => useContext(ModelContext);
