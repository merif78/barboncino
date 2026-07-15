"use client";

import Image from "next/image";

interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string | null;
}

export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  if (photos.length === 0) {
    return <p className="py-8 text-center text-brown-400">Nessuna foto ancora caricata.</p>;
  }

  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
      {photos.map((photo) => (
        <figure
          key={photo.id}
          className="group relative overflow-hidden rounded-lg break-inside-avoid bg-beige-100"
        >
          <Image
            src={photo.url}
            alt={photo.caption ?? "Foto del cane"}
            width={400}
            height={400}
            className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {photo.caption && (
            <figcaption className="absolute inset-x-0 bottom-0 bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              {photo.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
