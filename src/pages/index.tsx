import { type NextPage } from "next";
import Head from "next/head";
import NextImage from "next/image";
import HeroImg from "../../public/hero.webp";
import { Button } from "@ui/Button";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className="grid grid-cols-1 grid-rows-[45vh_45vh] md:grid-rows-[calc(100vh-64px)]">
          <div className="relative md:row-start-1 md:row-span-1 md:col-start-1 md:col-span-1">
            <NextImage src={HeroImg} fill style={{ objectFit: "cover" }} alt="" />
          </div>
          <div className="md:row-start-1 md:row-span-1 md:col-start-1 md:col-span-1 md:h-1/2 md:w-[40%] md:z-10 md:bg-primary md:align-self-center md:mt-[25vh] md:border-[3px] md:border-black md:ml-32 md:rounded-xl md:py-10">
            <h1 className="w-[70%] text-center mx-auto my-6">Meet your new favorite pantry staple!</h1>
            <div className="font-light text-opacity-75 w-[80%] mx-auto text-center">Cook restaurant-quality Asian dishes in under 30 minutes with our meal starters.</div>
            <div className="mx-auto w-44 my-6"><Button href="/meal-starters">Shop Now</Button></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
