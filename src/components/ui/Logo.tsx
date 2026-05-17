import Image from "next/image";

/* The PNG ships at roughly 3.2:1 aspect. Size by height; width follows.
   Note: the "Porta" middle text is rendered white in the asset, so on
   white backgrounds it disappears — that's a known limitation of using
   the PNG directly. */
const LOGO_RATIO = 3.2;

type LogoProps = {
  height?:   number;
  className?: string;
  priority?: boolean;
};

export function Logo({ height = 28, className, priority }: LogoProps) {
  const width = Math.round(height * LOGO_RATIO);
  return (
    <Image
      src="/portapiclogo.png"
      alt="Portapic"
      width={width}
      height={height}
      priority={priority}
      className={className}
      style={{ height, width: "auto" }}
    />
  );
}
