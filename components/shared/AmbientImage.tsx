import Image from "next/image";
import Vibrant from "node-vibrant";

const AmbientImage = async ({
  src,
  alt,
  ambient,
  className,
}: {
  src: string;
  alt: string;
  ambient: number;
  className?: string;
}) => {
  if (
    src.toLowerCase().endsWith("jpg") ||
    src.toLowerCase().endsWith("jpeg") ||
    src.toLowerCase().endsWith("png") ||
    src.toLowerCase().endsWith("gif")
  ) {
    const color = await Vibrant.from(src)
      .getPalette()
      .then((color) => {
        if (color.LightVibrant) {
          const shadowColor = color.LightVibrant.hex;
          return shadowColor;
        }
      });

    console.log(src);

    return (
      <Image
        src={src}
        alt={alt}
        width={1000}
        height={1000}
        className={`h-full w-full ${className ? className : "rounded-xl"} object-cover`}
        style={{
          boxShadow: `0px 0.01px 70px 0px ${color}${ambient}`,
        }}
      />
    );
  } else {
    return (
      <Image
        src={src}
        alt={alt}
        width={1000}
        height={1000}
        className={`h-full w-full ${className ? className : "rounded-xl"} object-cover`}
        style={{
          boxShadow: `0px 0.01px 70px 0px #1f513730`,
        }}
      />
    );
  }
};

export default AmbientImage;
