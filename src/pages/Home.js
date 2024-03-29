import Banner from '../components/Banner';
import Highlights from '../components/Highlights';
import FeaturedProducts from '../components/FeaturedProducts';
import App from '../App.css';

export default function Home() {

	const data = {
        title: "UrbanEdge: Where Style Meets the Streets!",
        content: "You're not just following trends; you're setting them.",
        destination: "/products",
        label: "BUY NOW!"
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

	return (
		<>
			<Banner data={data}/>
			<FeaturedProducts/>
			<div className="arrow-up" onClick={scrollToTop}>
                <i class="ri-arrow-up-s-line ri-3x"></i>
            </div>
		</>  
	)
}