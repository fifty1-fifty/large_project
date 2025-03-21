const app_name = 'group22cop4331c.xyz'

exports.buildPath =
function buildPath(route)
{
    if (process.env.NODE_ENV === 'production')
    {
        return 'https://' + app_name + route;
    }
    else
    {
        return 'http://localhost:5000/' + route;
    }
}