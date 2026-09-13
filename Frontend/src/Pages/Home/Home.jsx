import BrandStory from "../../components/BrandStory/BrandStory";
import CategoryShowcase from "../../components/CategoryShowcase/CategoryShowcase";
import CinematicVideo from "../../components/CinematicVideo/CinematicVideo";
import FeaturedCollection from "../../components/FeaturedCollection/FeaturedCollection";
import Footer from "../../components/Footer/Footer";
import Hero from "../../components/Hero/Hero";
import HomeCanvas from "../../components/HomeCanvas/HomeCanvas";
import Marquee from "../../components/Marquee/Marquee";
import NewArrivals from "../../components/NewArrivals/NewArrivals";
import Newsletter from "../../components/Newsletter/Newsletter";

import "./Home.css";

const Home = () => {
  return (
    <main className="home">
      <Hero />
      <FeaturedCollection />
      <HomeCanvas />
      <Marquee />
      <CinematicVideo />
      <NewArrivals />
      <CategoryShowcase />
      <BrandStory />
      <Newsletter />
      <Footer />
    </main>
  );
};

export default Home;
