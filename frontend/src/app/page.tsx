import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      Hello world

      <div>
        <Link href={'/map'}>
          {/* <a> */}Map{/* </a> */}
        </Link>
      </div>
    </div>
  );
}
