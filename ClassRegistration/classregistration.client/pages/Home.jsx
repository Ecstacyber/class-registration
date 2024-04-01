import WeatherForecast from "../components/WeatherForecast.jsx";
import { AuthorizeView, AuthorizedUser } from "../components/AuthorizeView.jsx";

function Home() {
    return (
        <AuthorizeView>
            <WeatherForecast />
        </AuthorizeView>
    );
}

export default Home;