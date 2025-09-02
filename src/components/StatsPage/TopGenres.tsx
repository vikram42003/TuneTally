import StatsPageErrorComponent from "./StatsPageErrorComponent";

interface TopGenresProps {
  genresMap: Map<string, number>;
}

const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-cyan-500",
];

const TopGenres = ({ genresMap }: TopGenresProps) => {
  if (!genresMap) {
    <StatsPageErrorComponent componentName="Top Genres" errorText="No data available" />;
  }

  const fullbar = genresMap.values().next().value!;

  return (
    <div className="py-8">
      <h4 className="text-spotify-green pr-4 text-center text-3xl font-bold">Top Genres</h4>

      <div className="py-4">
        {[...genresMap].map(([genre, count], idx) => (
          <div key={genre} className="flex py-2.5">
            <div className="flex-1 rounded-full bg-gray-500">
              <div
                className={`${colors[idx]} h-full rounded-full p-1`}
                style={{ width: `${(count / fullbar) * 100}%` }}
              >
                <span className="truncate pl-2 text-lg font-semibold">{genre}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TopGenresSkeleton = () => {
  return (
    <div className="py-8">
      <h4 className="text-spotify-green pr-4 text-center text-3xl font-bold">Top Genres</h4>

      <div className="animate-pulse space-y-4 py-6">
        {colors.map((c) => (
          <div key={c} className="h-10 rounded-full bg-gray-500 py-2.5"></div>
        ))}
      </div>
    </div>
  );
};

export default TopGenres;
