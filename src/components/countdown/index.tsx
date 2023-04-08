import { titleFont } from "@/src/utils/fonts";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import CharacterAnimation from "../animation/character";
import TextAnimation from "../animation/text";

const CountDown: FC = () => {
  const endDate = new Date("2023-04-26");

  const calculateCountdown = () => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  const [countdown, setCountdown] = useState(calculateCountdown());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [rotation, setRotation] = useState("rotate-0");

  useEffect(() => {
    const rot = `${-(countdown.seconds * 6) % 360}deg`;
    setRotation(rot);
  }, [countdown.seconds]);

  const countdownItems = [
    { value: countdown.days, label: "Days" },
    { value: countdown.hours, label: "Hours" },
    { value: countdown.minutes, label: "Minutes" },
    { value: countdown.seconds, label: "Seconds" },
  ];

  return (
    <section
      data-scroll
      data-scroll-speed="5"
      className={`text-white text-center ${titleFont.className} mb-40`}>
      <TextAnimation
        text="The wait is almost over!"
        className="flex justify-center"
        textStyle="text-2xl md:text-3xl font-semibold lg:text-5xl z-10"
      />
      <div className="flex flex-row  justify-center items-start sm:items-center gap-2 sm:gap-5 lg:gap-10 mt-4 drop-shadow-xl relative">
        <Image
          src={"/assets/png/helm.png"}
          width={400}
          height={400}
          alt="Ship Helm"
          className="absolute opacity-[8%] -z-10"
          style={{ transform: `rotate(${rotation})` }}
        />
        {countdownItems.map((item, index) => (
          <div key={index} className="mx-auto lg:mx-0">
            <CountdownItem {...item} />
          </div>
        ))}
      </div>
    </section>
  );
};

const CountdownItem = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col md:flex-row items-center  md:items-end">
    <CharacterAnimation
      text={value.toString()}
      textStyle="text-4xl lg:text-7xl font-extrabold"
      className="lg:w-[100px]"
    />
    <CharacterAnimation
      text={label}
      textStyle="text-lg sm:text-xl"
      className="ml-2"
    />
  </div>
);

export default CountDown;
