import Image from "next/image";

const BELO_LABEL = {
  senang: "Belo senang",
  ceria: "Belo ceria",
  ngantuk: "Belo ngantuk",
  bingung: "Belo bingung",
  "jatuh-cinta": "Belo jatuh cinta",
  kedip: "Belo mengedipkan mata",
  kaget: "Belo kaget",
  sedih: "Belo sedih",
  melambai: "Belo melambai",
  "baca-buku": "Belo membaca buku",
  "lompat-kegirangan": "Belo melompat kegirangan",
  "jempol-oke": "Belo memberi jempol",
  wisuda: "Belo wisuda",
  "mimpi-indah": "Belo bermimpi indah",
  "lari-semangat": "Belo berlari semangat",
  "nulis-catatan": "Belo menulis catatan",
  hero: "Belo melambai menyambut",
} as const;

export type BeloPose = keyof typeof BELO_LABEL;

/** Rasio tinggi/lebar tetap Belo (viewBox 160x192) supaya tidak gepeng di ukuran berapa pun. */
const BELO_ASPECT_RATIO = 192 / 160;

export function BeloMascot({
  className,
  pose = "senang",
  priority,
  size = 160,
}: {
  className?: string;
  pose?: BeloPose;
  priority?: boolean;
  size?: number;
}) {
  return (
    <Image
      alt={BELO_LABEL[pose]}
      className={className}
      height={Math.round(size * BELO_ASPECT_RATIO)}
      priority={priority}
      src={`/mascot/belo-${pose}.svg`}
      width={size}
    />
  );
}
