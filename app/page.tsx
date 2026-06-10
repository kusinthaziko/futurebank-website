import Hero from "./components/sections/Hero";
import SocialProof from "./components/sections/SocialProof";
import Problem from "./components/sections/Problem";
import Features from "./components/sections/Features";
import HowItWorks from "./components/sections/HowItWorks";
import AiSpotlight from "./components/sections/AiSpotlight";
import Security from "./components/sections/Security";
import Founders from "./components/sections/Founders";
import Download from "./components/sections/Download";

export default function Home() {
  return (
    <main>
      <Hero />
      <SocialProof />
      <Problem />
      <Features />
      <HowItWorks />
      <AiSpotlight />
      <Security />
      <Founders />
      <Download />
    </main>
  );
}
