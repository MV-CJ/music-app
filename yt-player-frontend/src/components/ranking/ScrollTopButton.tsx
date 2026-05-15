import { ChevronUp } from "lucide-react";

type Props = {
  visible: boolean;
  onClick: () => void;
};

export function ScrollTopButton({
  visible,
  onClick,
}: Props) {

  if (!visible) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="
        fixed
        bottom-24
        right-5
        z-50
        w-12
        h-12
        rounded-full
        bg-purple-600/90
        hover:bg-purple-500
        text-white
        shadow-2xl
        shadow-purple-500/30
        backdrop-blur-xl
        border
        border-white/10
        flex
        items-center
        justify-center
        transition-all
        duration-300
        hover:scale-110
      "
    >
      <ChevronUp size={22} />
    </button>
  );
}