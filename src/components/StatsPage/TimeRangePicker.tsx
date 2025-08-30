import { SpotifyTimeRange } from "../../types/spotifyTypes";

interface TimeRangePickerProps {
  timeRange: SpotifyTimeRange;
  setTimeRange: React.Dispatch<React.SetStateAction<SpotifyTimeRange>>;
}

const TimeRangePicker = ({ timeRange, setTimeRange }: TimeRangePickerProps) => {
  const css = "border-spotify-green flex-1 border text-center cursor-pointer hover:underline ";
  const selectedCss = "bg-spotify-green text-black hover:no-underline!";

  return (
    <div className="flex">
      <button
        onClick={() => setTimeRange("short_term")}
        className={css + (timeRange === "short_term" ? selectedCss : "")}
      >
        4 weeks
      </button>

      <button
        onClick={() => setTimeRange("medium_term")}
        className={css + (timeRange === "medium_term" ? selectedCss : "")}
      >
        6 months
      </button>

      <button
        onClick={() => setTimeRange("long_term")}
        className={css + (timeRange === "long_term" ? selectedCss : "")}
      >
        1 year
      </button>
    </div>
  );
};

export default TimeRangePicker;
