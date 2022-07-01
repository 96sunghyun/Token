import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import WrapperBasic from "../components/WrapperBasic";
import WrapperBody from "../components/WrapperBody";
import Details from "./Details";

export default function Main() {
    return (
        <WrapperBasic>
            <Navbar resetLogin={true} />
            <div className="flex flex-col items-center w-full mt-10 h-20">
                <h1 className="text-4xl font-bold">Welcome.</h1>
            </div>
            <WrapperBody>
                <Details />
            </WrapperBody>
            <Footer />
        </WrapperBasic>
    )
}