import Background from '../components/Login/Background.tsx';
import FriendsHome from '../components/Home/FriendsHome.tsx';


const HomePage = () =>
{
    return(
        <div>
            <FriendsHome />
            <Background />
            <h2>Friends posts in progress</h2>
        </div>
        );
}

export default HomePage;
