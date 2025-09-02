interface SpotifyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  handler: () => void;
  text: string;
}

const SpotifyButton = ({ handler, text, className }: SpotifyButtonProps) => {
  return (
    <button
      type="button"
      onClick={handler}
      // shadow-[0_0_20px_rgba(29,185,84,0.6)] does the green glow effect
      className={
        "bg-spotify-green cursor-pointer rounded-4xl px-6 py-2 font-bold text-black shadow-[0_0_20px_rgba(29,185,84,0.6)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(29,185,84,0.9)] " +
          className || ""
      }
    >
      {text}
    </button>
  );
};

export default SpotifyButton;
