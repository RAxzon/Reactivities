import { withRouter } from "react-router-dom";
import { useEffect } from "react";

const ScrollsToTop = ({children, location: {pathname} }: any) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname])

    return children;
};

export default withRouter(ScrollsToTop);