import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { FaUserCircle } from "react-icons/fa";
import { LoaderIcon } from "lucide-react";
import { useStateContext } from "../context/ThirdWebWrapper";
import { useRouter } from "next/router";

/**
 * Props for the ViewReportComponent.
 * @interface
 * @property {string} address - The address of the patient.
 */
type Props = {
  address: string;
};

/**
 * Interface representing a medical report.
 * @interface
 * @property {string} name - Patient's name.
 * @property {string} doctor - Doctor's name.
 * @property {string} report - Medical report.
 * @property {string} date_of_time - Date and time of the report.
 */
interface IReport {
  name: string;
  doctor: string;
  report: string;
  date_of_time: string;
}

/**
 * Converts a string representing time to a number.
 * @function
 * @param {string} time - Time as a string.
 * @returns {number} - Time as a number.
 */
const ConvertToTime = (time: string): number => {
  var withoutCommas = time.replace(/,/g, "");
  var result = parseInt(withoutCommas);
  return result;
};

/**
 * ViewReportComponent is used to display a patient's medical report.
 * @function
 */
const ViewReportComponent = (props: Props) => {
  const [reportLoading, setReportLoading] = React.useState<boolean>(false);
  const { contract, address } = useStateContext();
  const [state, setState] = React.useState<boolean>(false);
  const [report, setReport] = React.useState<IReport | null>(null);
  const router = useRouter();

  /**
   * Fetches the medical report.
   * @function
   */
  const GetReport = async () => {
    setReportLoading(true);
    const data = await contract!.call("getReport", [address, props.address]);
    setReport({
      name: data[0],
      doctor: data[1],
      report: data[2],
      date_of_time: data[3],
    });
    setReportLoading(false);
  };

  return (
    <Collapsible open={state} onOpenChange={(value) => setState(value)}>
      <div className="flex py-1 border border-neutral-400/10 transition hover:bg-neutral-400/10 cursor-pointer justify-between items-center px-2">
        <div className="flex items-center gap-x-2">
          <FaUserCircle size={40} />
          <p className="text-xs">{props.address}</p>
        </div>
        <CollapsibleTrigger
          onClick={() => {
            if (
              report === null ||
              report.doctor === null ||
              report.name === null
            ) {
              GetReport();
            }
          }}
          className="border border-red-500 bg-red-500/20 text-red-200 text-xs rounded px-2 py-1"
        >
          {reportLoading ? (
            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Check Report"
          )}
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        {reportLoading ? (
          <div className="h-10 flex justify-center items-center">
            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
          </div>
        ) : (
          report !== null && (
            <div className="p-2 border border-neutral-400/10">
              <h1 className="text-md text-zinc-300">
                Patient Name:{" "}
                <span className="text-neutral-400 capitalize text-sm">
                  {report?.name}
                </span>
              </h1>
              <h1 className="text-md text-zinc-300">
                Report by:{" "}
                <span className="text-neutral-400 capitalize text-sm">
                  {report?.doctor}
                </span>
              </h1>
              <h1 className="text-md text-zinc-300">
                Report:{" "}
                <span className="text-neutral-400 capitalize text-sm">
                  {report?.report}
                </span>
              </h1>
              <h1 className="text-md text-zinc-300">
                Date of Report:{" "}
                <span className="text-neutral-400 capitalize text-sm">
                  {new Date(ConvertToTime(report!.date_of_time)).toDateString()}
                </span>
              </h1>
            </div>
          )
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ViewReportComponent;
