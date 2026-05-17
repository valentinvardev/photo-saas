import Image from "next/image";

/* Two assets, picked by theme.
   - portapiclogo.png is the yellow + white wordmark → looks right on
     dark backgrounds.
   - logoblack.png is the all-black wordmark → looks right on light
     backgrounds.

   Rather than reading the theme in JS (would FOUC on first paint), we
   render both <Image>s and toggle their visibility with the `.dark`
   class on <html>. SSR-safe, zero hydration mismatch. */

const RATIO_DARK  = 3.2;   // portapiclogo.png  (≈1100×344)
const RATIO_LIGHT = 3.66;  // logoblack.png     (≈1024×280)

type LogoProps = {
  height?:   number;
  className?: string;
  priority?: boolean;
};

export function Logo({ height = 47, className, priority }: LogoProps) {
  const widthDark  = Math.round(height * RATIO_DARK);
  const widthLight = Math.round(height * RATIO_LIGHT);

  return (
    <span className={`relative inline-flex items-center ${className ?? ""}`} style={{ height }}>
      {/* Light theme — visible when html is NOT .dark */}
      <Image
        src="/logoblack.png"
        alt="Portapic"
        width={widthLight}
        height={height}
        priority={priority}
        className="block dark:hidden"
        style={{ height, width: "auto" }}
      />
      {/* Dark theme — visible when html IS .dark */}
      <Image
        src="/portapiclogo.png"
        alt=""
        aria-hidden
        width={widthDark}
        height={height}
        priority={priority}
        className="hidden dark:block"
        style={{ height, width: "auto" }}
      />
    </span>
  );
}
