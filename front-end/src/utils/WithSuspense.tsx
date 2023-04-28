import { Suspense } from "react";

export function WithSuspense(Component: React.FC): JSX.Element {
    return <Suspense fallback={null}>
        <Component /> 
    </Suspense>
}