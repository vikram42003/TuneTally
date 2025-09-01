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
  const fullbar = genresMap.values().next().value;

  return (
    <div className="py-4">
      <h4 className="text-spotify-green pr-4 text-center text-3xl font-bold">Top {genresMap.size} Genres</h4>

      <div className="py-4">
        {[...genresMap].map(([genre, count], idx) => (
          <div key={genre} className="flex py-1">
            <div className="w-16 text-sm font-medium flex-1/12 shrink-0">{genre}</div>
            <div className="bg-gray-500 flex-11/12">
              <div className={`${colors[idx]}`}></div>
            </div>
          </div>
          // <div key={genre} className="flex items-center space-x-3">
          //   <span className="w-16 text-sm font-medium">{genre}</span>
          //   <div className="h-6 flex-1 rounded-full bg-gray-200">
          //     <div
          //       className="flex h-6 items-center justify-end rounded-full bg-blue-500 pr-2"
          //       style={{ width: `${count}%` }}
          //     >
          //       <span className="text-xs text-white">{count}</span>
          //     </div>
          //   </div>
          // </div>
        ))}
      </div>
    </div>
  );
};

export default TopGenres;
