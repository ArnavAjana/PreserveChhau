import Image from "next/image";

export function AboutAuthorPhoto() {
  return (
    <figure className="about-author-photo">
      <Image
        alt="Arnav Ajana offering his hand to a horse outdoors"
        className="about-author-photo-image"
        height={2048}
        sizes="(max-width: 700px) 90vw, 18rem"
        src="/images/arnav-ajana-about.jpg"
        width={1839}
      />
      <figcaption>Arnav Ajana</figcaption>
    </figure>
  );
}
