import Image, { type ImageProps } from "next/image";
import { blurData } from "@/content/blur";

/**
 * next/image with an automatic blurred preview, so photos appear instantly as
 * a soft blur and sharpen when the full image arrives.
 */
export default function Img({ alt, ...props }: ImageProps) {
  const blur = typeof props.src === "string" ? blurData[props.src] : undefined;
  return <Image alt={alt} {...(blur ? { placeholder: "blur" as const, blurDataURL: blur } : {})} {...props} />;
}
