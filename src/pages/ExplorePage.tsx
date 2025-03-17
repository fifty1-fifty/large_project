import Gallery_Ex from '../components/Explore/Gallery_Ex.tsx';
import Search_Ex from '../components/Explore/Search_Ex.tsx';
import Navigation from '../components/Navigation/Navigation.tsx';


const ExplorePage = () =>
{
    return(
        <div>
            <Navigation />
            <Search_Ex />
            <Gallery_Ex />
        </div>
        );
}

export default ExplorePage;