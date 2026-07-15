import Image from "next/image";

export function AboutAuthorProfile() {
  return (
    <figure className="about-author-profile">
      <Image
        alt="Arnav Ajana standing beside a horse"
        className="about-author-image"
        height={2048}
        priority
        sizes="(min-width: 1400px) 30vw, (min-width: 900px) 38vw, 92vw"
        src="/images/arnav-ajana-about.jpg"
        width={1839}
      />
      <figcaption className="about-author-caption">
        <p className="reader-kicker text-laterite-700">About the author</p>
        <p className="about-author-name">Arnav Ajana</p>
        <p className="about-author-role">
          Student, performer, researcher, and creator of PreserveChhau
        </p>
        <p className="about-author-credit">Photograph supplied by Arnav Ajana.</p>
      </figcaption>
    </figure>
  );
}
