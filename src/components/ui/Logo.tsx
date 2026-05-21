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
  height?:     number;
  darkHeight?: number;  /* if different from height */
  className?:  string;
  priority?:   boolean;
};

export function Logo({ height = 47, darkHeight, className, priority }: LogoProps) {
  const dh = darkHeight ?? height;

  return (
    <span className={`relative inline-flex items-center ${className ?? ""}`}>
      {/* Light theme */}
      <Image
        src="/logoblack.png"
        alt="Portapic"
        width={Math.round(height * RATIO_LIGHT)}
        height={height}
        priority={priority}
        className="block dark:hidden"
        style={{ height, width: "auto" }}
      />
      {/* Dark theme */}
      <Image
        src="/portapiclogo.png"
        alt=""
        aria-hidden
        width={Math.round(dh * RATIO_DARK)}
        height={dh}
        priority={priority}
        className="hidden dark:block"
        style={{ height: dh, width: "auto" }}
      />
    </span>
  );
}
