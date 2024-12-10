import Image from "next/image";
import Link from "next/link";

const AnglePClassCard = async () => {
  return (
    <div className="flex justify-center p-4 w-1/3">
      <Link
        href={`/student/lessons/angle-pairs`}
        className="border rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-200"
      >
        <Image
          src="/3.png"
          alt="angle"
          width={500}
          height={300}
          className="rounded-t-xl w-[320px] h-[180px] object-cover"
        />
        <div className="px-4 py-3 flex flex-col gap-2">
          <h2 className="text-lg font-bold hover:text-[#31803a]">Angle Pairs</h2>
        </div>
      </Link>
    </div>
  );
};

export default AnglePClassCard;