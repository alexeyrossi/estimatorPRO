import { Calculator, ClipboardList, Loader2, LogOut, Truck } from "lucide-react";

type DashboardHeaderProps = {
  activeTab: "config" | "report";
  clientName: string;
  hasUsableEstimate: boolean;
  isSaving: boolean;
  isSigningOut: boolean;
  onClientNameChange: (value: string) => void;
  onLogout: () => void;
  onSaveEstimate: () => void;
  onTabChange: (tab: "config" | "report") => void;
  onToggleHistory: () => void;
  saveErrorMessage: string | null;
  saveStatus: "idle" | "success" | "error";
};

export function DashboardHeader({
  activeTab,
  clientName,
  hasUsableEstimate,
  isSaving,
  isSigningOut,
  onClientNameChange,
  onLogout,
  onSaveEstimate,
  onTabChange,
  onToggleHistory,
  saveErrorMessage,
  saveStatus,
}: DashboardHeaderProps) {
  return (
    <div className="w-full max-w-6xl mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-12 h-12 rounded-[1rem] bg-gray-900 flex items-center justify-center relative overflow-hidden group shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
          <Truck className="w-6 h-6 absolute -left-[2px] text-gray-400 group-hover:text-white transition-colors" />
          <div className="absolute right-1 bottom-1 bg-white text-gray-900 rounded-[4px] p-0.5 shadow-sm">
            <Calculator className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex min-w-0 flex-col">
          <h1 className="text-xl font-black text-gray-900 leading-none tracking-tight">Estimator</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">v11.59</span>
            <span className="text-[8px] font-black text-white bg-blue-600 shadow-sm px-1.5 py-0.5 rounded tracking-widest uppercase">PRO</span>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 relative">
        <div className="flex items-center gap-2 bg-white rounded-[1.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-1.5 border border-transparent">
          <input
            type="text"
            placeholder="Client name"
            value={clientName}
            onChange={(event) => onClientNameChange(event.target.value)}
            className="bg-gray-50 border-transparent rounded-xl px-4 py-2 text-[14px] text-gray-900 font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all outline-none w-36"
          />
          <button
            onClick={onSaveEstimate}
            disabled={!clientName.trim() || isSaving || !hasUsableEstimate}
            className={`rounded-xl px-4 py-2 text-[14px] font-medium transition-all duration-300 whitespace-nowrap active:scale-95 w-[96px] flex justify-center items-center text-center disabled:opacity-50 disabled:cursor-not-allowed ${saveStatus === "success" ? "bg-emerald-500 text-white" : isSaving ? "bg-gray-900 text-white" : clientName.trim() ? "bg-gray-900 text-white hover:bg-gray-800 shadow-sm" : "bg-gray-400 text-white"}`}
          >
            {saveStatus === "success" ? "✓ Saved" : isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
          </button>
        </div>
        {saveStatus === "error" && (
          <div className="absolute top-[105%] left-4 max-w-[340px] text-red-500 text-[11px] font-bold">{saveErrorMessage || "Save failed. Please try again."}</div>
        )}

        <button
          onClick={onToggleHistory}
          className="bg-white rounded-[1.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.03)] px-4 py-2 flex items-center gap-2 text-[12px] font-bold text-gray-400 hover:text-gray-600 transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 border border-transparent active:scale-95"
        >
          <ClipboardList className="w-4 h-4" strokeWidth={2} />
          History
        </button>

        <button
          onClick={onLogout}
          disabled={isSigningOut}
          className="bg-white rounded-[1.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.03)] px-4 py-2 flex items-center gap-2 text-[12px] font-bold text-gray-400 hover:text-gray-600 transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 border border-transparent active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_24px_rgba(0,0,0,0.03)]"
        >
          {isSigningOut ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} /> : <LogOut className="w-4 h-4" strokeWidth={2} />}
          {isSigningOut ? "Signing out..." : "Logout"}
        </button>
      </div>

      <div className="md:hidden flex w-full items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-1 rounded-2xl bg-white border border-transparent shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-1.5">
          {(["config", "report"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${activeTab === tab ? "bg-gray-50 text-gray-900" : "text-gray-500 bg-transparent hover:bg-gray-50 hover:text-gray-900"}`}
            >
              {tab === "config" ? "Config" : "Report"}
            </button>
          ))}
        </div>
        <button
          onClick={onToggleHistory}
          className="shrink-0 rounded-2xl bg-white border border-transparent shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
          aria-label="Open history"
          title="History"
        >
          <ClipboardList className="w-4 h-4" strokeWidth={2} />
        </button>
        <button
          onClick={onLogout}
          disabled={isSigningOut}
          className="shrink-0 rounded-2xl bg-white border border-transparent shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-2.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-white disabled:hover:text-gray-500"
          aria-label="Logout"
          title="Logout"
        >
          {isSigningOut ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} /> : <LogOut className="w-4 h-4" strokeWidth={2} />}
        </button>
      </div>
    </div>
  );
}
