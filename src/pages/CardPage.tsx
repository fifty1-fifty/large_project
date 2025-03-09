import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedIn/LoggedInName';
import CardUI from '../components/LoggedIn/CardUI';

const CardPage = () =>
{
    return(
        <div>
            <PageTitle />
            <LoggedInName />
            <CardUI />
        </div>
        );
}

export default CardPage;