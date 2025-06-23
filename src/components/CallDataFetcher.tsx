
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetchCallData } from "@/hooks/useFetchCallData";
import { Phone, Download } from "lucide-react";

const CallDataFetcher = () => {
  const [callId, setCallId] = useState("");
  const { fetchCallData, isFetching } = useFetchCallData();

  const handleFetchCallData = () => {
    if (!callId.trim()) return;
    fetchCallData(callId.trim());
  };

  return (
    <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
      <div className="flex items-center mb-4">
        <div className="w-14 h-14 bg-blue-400 rounded-2xl flex items-center justify-center mr-4">
          <Download className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
            FETCH CALL DATA
          </h3>
          <p className="text-gray-600 font-medium text-sm">
            Retrieve call data from VAPI by call ID
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="callId" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            VAPI Call ID
          </label>
          <Input
            id="callId"
            type="text"
            value={callId}
            onChange={(e) => setCallId(e.target.value)}
            placeholder="Enter VAPI call ID..."
            className="w-full rounded-2xl border-2 border-gray-300 px-4 py-3 font-medium"
          />
        </div>

        <Button
          onClick={handleFetchCallData}
          disabled={isFetching || !callId.trim()}
          className={`w-full rounded-2xl py-3 px-6 font-bold uppercase tracking-wide transition-all duration-150 ${
            isFetching || !callId.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-400 text-white hover:bg-blue-500 active:scale-95'
          }`}
        >
          <Phone className="w-5 h-5 mr-2" />
          {isFetching ? 'FETCHING DATA...' : 'FETCH CALL DATA'}
        </Button>

        <div className="text-xs text-gray-500 bg-gray-50 rounded-2xl p-3">
          <p className="font-medium">
            💡 <strong>How to get the call ID:</strong>
          </p>
          <p>
            The call ID is returned when you start a call or can be found in your VAPI dashboard under call logs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallDataFetcher;
