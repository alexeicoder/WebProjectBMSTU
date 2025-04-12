import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from '../../routes/routes';
import PageLayout from "../../components/PageLayout/PageLayout";

function HomePage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Example of how you might use axios (if you decide to use it)
                // const response = await axios.get(SERVICE_AUTH.VALIDATE_TOKEN, { withCredentials: true });
                // if (response.status !== 200) {
                //     throw new Error('Failed to validate token');
                // }
                // console.log("Token is valid");
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
                // Redirect to login if token is invalid
                navigate(ROUTES.SIGN_IN);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <PageLayout>
                <div>
                    Home Page
                </div>
            </PageLayout>
        </>
    );
}

export default HomePage;
