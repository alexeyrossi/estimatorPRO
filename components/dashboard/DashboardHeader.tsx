import { Bookmark, Calculator, Loader2, LogOut, Settings, Truck } from "lucide-react";
import { dashboardChrome } from "./chromeStyles";

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
    <div className="w-full max-w-6xl mb-4 md:mb-8 flex flex-col gap-2 md:gap-3">
      <div className="hidden md:flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-[1rem] bg-gray-900 flex items-center justify-center relative overflow-hidden group shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
            <Truck className="w-6 h-6 absolute -left-[2px] text-slate-400 group-hover:text-white transition-colors" />
            <div className="absolute right-1 bottom-1 bg-white text-slate-900 rounded-[4px] p-0.5 shadow-sm">
              <Calculator className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex min-w-0 flex-col">
            <h1 className="text-xl font-black text-slate-900 leading-none tracking-tight">Estimator</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={dashboardChrome.helperText}>v1.01</span>
              <span className="text-[8px] font-black text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 shadow-sm px-1.5 py-0.5 rounded tracking-widest uppercase">AI</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative">
          <div className={`flex items-center gap-2 p-1.5 ${dashboardChrome.controlShell}`}>
            <input
              type="text"
              placeholder="Client name"
              value={clientName}
              onChange={(event) => onClientNameChange(event.target.value)}
              className={dashboardChrome.input}
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
            className={`flex items-center gap-2 ${dashboardChrome.controlButton}`}
          >
            <Bookmark className="w-4 h-4" strokeWidth={2} />
            History
          </button>

          <button
            onClick={onLogout}
            disabled={isSigningOut}
            className={`flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:border-slate-100 disabled:hover:bg-white disabled:hover:text-slate-500 disabled:hover:shadow-[0_4px_24px_rgba(15,23,42,0.04)] ${dashboardChrome.controlButton}`}
          >
            {isSigningOut ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} /> : <LogOut className="w-4 h-4" strokeWidth={2} />}
            {isSigningOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </div>

      <div className="md:hidden flex w-full items-center gap-2">
        <div className={dashboardChrome.segmentedShell}>
          {(["config", "report"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap inline-flex items-center justify-center gap-1.5 ${activeTab === tab ? dashboardChrome.segmentedActive : dashboardChrome.segmentedInactive}`}
            >
              {tab === "config"
                ? <><Settings className="w-3.5 h-3.5" aria-hidden="true" /><span>Parameters</span></>
                : <><Calculator className="w-3.5 h-3.5" aria-hidden="true" /><span>Estimate</span></>}
            </button>
          ))}
        </div>
        <button
          onClick={onToggleHistory}
          className={dashboardChrome.iconButton}
          aria-label="Open history"
          title="History"
        >
          <Bookmark className="w-4 h-4" strokeWidth={2} />
        </button>
        <button
          onClick={onLogout}
          disabled={isSigningOut}
          className={`${dashboardChrome.iconButton} hover:border-red-100 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-slate-100 disabled:hover:bg-white disabled:hover:text-slate-500`}
          aria-label="Logout"
          title="Logout"
        >
          {isSigningOut ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} /> : <LogOut className="w-4 h-4" strokeWidth={2} />}
        </button>
      </div>
    </div>
  );
}
