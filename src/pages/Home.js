import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';
import ScrollBehavior from '../components/ScrollBehavior';

export default function Home() {
    const data = {
        title: "UrbanEdge: Where Style Meets the Streets!",
        content: "You're not just following trends; you're setting them.",
        destination: "/products",
        label: "BUY NOW!"
    }

    return (
        <>
            <Banner data={data}/>
            <FeaturedProducts/>
            <ScrollBehavior/>
        </>  
    )
}